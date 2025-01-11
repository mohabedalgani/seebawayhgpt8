/*
  # Create votes table and policies

  1. New Tables
    - `votes`
      - `id` (uuid, primary key)
      - `message_id` (text, required)
      - `user_id` (uuid, required, references auth.users)
      - `vote_type` (text, required)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `votes` table
    - Add policies for authenticated users to:
      - Insert their own votes
      - Read all votes
      - Update their own votes
*/

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  vote_type text NOT NULL CHECK (vote_type IN ('correct', 'error')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);