/*
  # Add feedback column to votes table

  1. Changes
    - Add `feedback` column to `votes` table for error reports
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'feedback'
  ) THEN
    ALTER TABLE votes ADD COLUMN feedback text;
  END IF;
END $$;