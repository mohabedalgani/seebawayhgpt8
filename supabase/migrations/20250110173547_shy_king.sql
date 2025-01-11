/*
  # Add return cards columns to votes table

  1. New Columns
    - `original_text` (text): The original text that was analyzed
    - `corrected_text` (text): The user's corrected version (for error votes)
    - `correction_type` (text): Type of correction (grammar, spelling, analysis, etc.)
    - `correction_details` (jsonb): Detailed explanation of corrections
    - `tags` (text[]): Categories or tags for the correction
    - `reviewed` (boolean): Whether this correction has been reviewed
    - `review_notes` (text): Notes from the review process
    - `review_status` (text): Status of the review (pending, approved, rejected)

  2. Changes
    - Add new columns to existing votes table
    - Add check constraint for correction_type values
    - Add check constraint for review_status values
    - Set default values for boolean fields
*/

DO $$ 
BEGIN 
  -- Add original_text column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'original_text'
  ) THEN
    ALTER TABLE votes ADD COLUMN original_text text;
  END IF;

  -- Add corrected_text column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'corrected_text'
  ) THEN
    ALTER TABLE votes ADD COLUMN corrected_text text;
  END IF;

  -- Add correction_type column with check constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'correction_type'
  ) THEN
    ALTER TABLE votes ADD COLUMN correction_type text;
    ALTER TABLE votes ADD CONSTRAINT valid_correction_type 
      CHECK (correction_type IN ('grammar', 'spelling', 'analysis', 'other'));
  END IF;

  -- Add correction_details column as JSONB for flexible metadata
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'correction_details'
  ) THEN
    ALTER TABLE votes ADD COLUMN correction_details jsonb DEFAULT '{}'::jsonb;
  END IF;

  -- Add tags array
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'tags'
  ) THEN
    ALTER TABLE votes ADD COLUMN tags text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add reviewed flag
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'reviewed'
  ) THEN
    ALTER TABLE votes ADD COLUMN reviewed boolean DEFAULT false;
  END IF;

  -- Add review_notes
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'review_notes'
  ) THEN
    ALTER TABLE votes ADD COLUMN review_notes text;
  END IF;

  -- Add review_status with check constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'votes' AND column_name = 'review_status'
  ) THEN
    ALTER TABLE votes ADD COLUMN review_status text DEFAULT 'pending';
    ALTER TABLE votes ADD CONSTRAINT valid_review_status 
      CHECK (review_status IN ('pending', 'approved', 'rejected'));
  END IF;

END $$;