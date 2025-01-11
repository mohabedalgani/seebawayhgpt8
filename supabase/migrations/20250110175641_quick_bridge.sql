/*
  # Update notification function with HTTP extension
  
  1. Changes
    - Enable HTTP extension
    - Drop and recreate trigger with CASCADE
    - Update notification function to use HTTP extension
  
  2. Security
    - Function runs with SECURITY DEFINER
    - Uses proper error handling
*/

-- Enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA extensions;

-- Drop the trigger and function with CASCADE to handle dependencies
DROP TRIGGER IF EXISTS on_vote_recorded ON votes CASCADE;
DROP FUNCTION IF EXISTS notify_vote_recorded() CASCADE;

-- Create or replace the notification function
CREATE OR REPLACE FUNCTION notify_vote_recorded()
RETURNS TRIGGER AS $$
DECLARE
  api_url text;
  auth_token text;
BEGIN
  -- Get settings with defaults
  api_url := COALESCE(
    (SELECT value FROM app_settings WHERE key = 'supabase_url'),
    current_setting('SUPABASE_URL', true)
  );
  
  auth_token := COALESCE(
    (SELECT value FROM app_settings WHERE key = 'service_role_key'),
    current_setting('SERVICE_ROLE_KEY', true)
  );

  -- Call the Edge Function to send the email using extensions.http
  PERFORM
    extensions.http_post(
      url := CONCAT(api_url, '/functions/v1/send-vote-email'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', CONCAT('Bearer ', auth_token)
      ),
      body := jsonb_build_object(
        'message_id', NEW.message_id,
        'vote_type', NEW.vote_type,
        'feedback', NEW.feedback,
        'original_text', NEW.original_text,
        'corrected_text', NEW.corrected_text,
        'correction_type', NEW.correction_type,
        'correction_details', NEW.correction_details,
        'review_status', NEW.review_status
      )::text
    );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and continue
    RAISE WARNING 'Error in notify_vote_recorded: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_vote_recorded
  AFTER INSERT OR UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION notify_vote_recorded();