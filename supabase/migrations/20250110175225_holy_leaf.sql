/*
  # Add database trigger for vote notifications

  1. New Functions
    - `notify_vote_recorded`: Function to trigger email notifications when votes are recorded
  
  2. New Triggers
    - `on_vote_recorded`: Trigger that calls notify_vote_recorded after vote insertion
*/

-- Create the notification function
CREATE OR REPLACE FUNCTION notify_vote_recorded()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to send the email
  PERFORM
    net.http_post(
      url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/send-vote-email'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key'))
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

-- Create the trigger
DROP TRIGGER IF EXISTS on_vote_recorded ON votes;
CREATE TRIGGER on_vote_recorded
  AFTER INSERT OR UPDATE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION notify_vote_recorded();