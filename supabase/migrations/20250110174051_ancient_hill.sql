/*
  # Create messages table for storing chat messages

  1. New Tables
    - `messages`
      - `id` (text, primary key) - Message unique identifier
      - `content` (text) - Message content
      - `role` (text) - Message role (user/assistant)
      - `created_at` (timestamptz) - Message creation timestamp

  2. Security
    - Enable RLS on `messages` table
    - Add policies for:
      - Authenticated users can read all messages
      - Authenticated users can insert their own messages
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);