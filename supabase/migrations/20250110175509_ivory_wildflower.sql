/*
  # Setup email notification configuration
  
  1. Configuration
    - Create custom settings table for app configuration
    - Add function to safely get settings
    - Add function to notify on vote recording
  
  2. Security
    - Enable RLS on settings table
    - Set up secure access policies
*/

-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read settings"
  ON app_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to safely get setting value with default
CREATE OR REPLACE FUNCTION get_setting(setting_key text, default_value text DEFAULT NULL)
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    (SELECT value FROM app_settings WHERE key = setting_key),
    default_value
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update notify_vote_recorded function to use the settings table
CREATE OR REPLACE FUNCTION notify_vote_recorded()
RETURNS TRIGGER AS $$
DECLARE
  api_url text;
  auth_token text;
BEGIN
  -- Get settings with defaults
  api_url := COALESCE(get_setting('supabase_url'), current_setting('SUPABASE_URL', true));
  auth_token := COALESCE(get_setting('service_role_key'), current_setting('SERVICE_ROLE_KEY', true));

  -- Call the Edge Function to send the email
  PERFORM
    net.http_post(
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
      )
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;