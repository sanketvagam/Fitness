/*
  # Create Fitness Goals Table

  1. New Tables
    - `fitness_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `target_value` (numeric)
      - `current_value` (numeric)
      - `unit` (text)
      - `deadline` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `fitness_goals` table
    - Add policies for users to manage their own goals
*/

CREATE TABLE IF NOT EXISTS fitness_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  target_value numeric,
  current_value numeric DEFAULT 0,
  unit text,
  deadline timestamptz,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fitness_goals_user_id_idx ON fitness_goals(user_id);

ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own goals"
  ON fitness_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON fitness_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON fitness_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON fitness_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);