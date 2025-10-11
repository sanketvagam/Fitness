/*
  # Create Meal Templates Table

  1. New Tables
    - `meal_templates`
      - `id` (uuid, primary key) - Unique identifier for each meal template
      - `user_id` (uuid, foreign key) - References auth.users
      - `name` (text) - Name of the meal
      - `calories` (integer) - Calorie count
      - `protein` (integer) - Protein in grams
      - `carbs` (integer) - Carbohydrates in grams
      - `fats` (integer) - Fats in grams
      - `meal_type` (text) - Type: breakfast, lunch, dinner, snack
      - `usage_count` (integer) - Track how many times used
      - `created_at` (timestamptz) - When the template was created
      - `updated_at` (timestamptz) - Last time template was used

  2. Security
    - Enable RLS on `meal_templates` table
    - Add policies for authenticated users to manage their own meal templates
*/

CREATE TABLE IF NOT EXISTS meal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  calories integer NOT NULL DEFAULT 0,
  protein integer NOT NULL DEFAULT 0,
  carbs integer NOT NULL DEFAULT 0,
  fats integer NOT NULL DEFAULT 0,
  meal_type text NOT NULL,
  usage_count integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal templates"
  ON meal_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal templates"
  ON meal_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal templates"
  ON meal_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal templates"
  ON meal_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_meal_templates_user_id ON meal_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_templates_name ON meal_templates(user_id, name);
CREATE INDEX IF NOT EXISTS idx_meal_templates_meal_type ON meal_templates(user_id, meal_type);