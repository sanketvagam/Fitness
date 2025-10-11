/*
  # Create Workout Adherence Coaching Schema

  1. New Tables
    - `micro_plans`
      - `id` (uuid, primary key)
      - `name` (text) - Plan name (e.g., "5-min Morning Mobility")
      - `duration` (int) - Duration in minutes (5, 10, 15, or 20)
      - `category` (text) - cardio, strength, mobility, flexibility
      - `time_preference` (text) - AM, PM, or anytime
      - `progression_level` (int) - 1-5 for difficulty
      - `cues` (jsonb) - Array of cue text strings
      - `created_at` (timestamptz)

    - `workout_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `plan_id` (uuid, foreign key to micro_plans)
      - `completed_at` (timestamptz)
      - `duration_minutes` (int) - Actual duration completed
      - `rpe` (int) - Rate of Perceived Exertion (0-10)
      - `pain` (int) - Pain level (0-10)
      - `notes` (text)
      - `created_at` (timestamptz)

    - `pain_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `area` (text) - body area (knee, back, shoulder, etc.)
      - `level` (int) - Pain level (0-10)
      - `date` (date)
      - `created_at` (timestamptz)

    - `adherence_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, unique)
      - `complete_streak` (int) - Current consecutive days completed
      - `miss_streak` (int) - Current consecutive days missed
      - `last_activity_date` (date)
      - `total_aqm` (int) - All-time Activity Quality Minutes
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - micro_plans are readable by all authenticated users
*/

-- Create micro_plans table
CREATE TABLE IF NOT EXISTS micro_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration int NOT NULL CHECK (duration IN (5, 10, 15, 20)),
  category text NOT NULL CHECK (category IN ('cardio', 'strength', 'mobility', 'flexibility')),
  time_preference text NOT NULL CHECK (time_preference IN ('AM', 'PM', 'anytime')),
  progression_level int NOT NULL CHECK (progression_level BETWEEN 1 AND 5),
  cues jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create workout_sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES micro_plans(id) ON DELETE SET NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  duration_minutes int NOT NULL,
  rpe int CHECK (rpe BETWEEN 0 AND 10),
  pain int CHECK (pain BETWEEN 0 AND 10),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create pain_tracking table
CREATE TABLE IF NOT EXISTS pain_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  area text NOT NULL,
  level int NOT NULL CHECK (level BETWEEN 0 AND 10),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, area, date)
);

-- Create adherence_stats table
CREATE TABLE IF NOT EXISTS adherence_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  complete_streak int DEFAULT 0,
  miss_streak int DEFAULT 0,
  last_activity_date date,
  total_aqm int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_completed_at ON workout_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_pain_tracking_user_date ON pain_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_adherence_stats_user_id ON adherence_stats(user_id);

-- Enable RLS
ALTER TABLE micro_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE adherence_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for micro_plans (readable by all authenticated users)
CREATE POLICY "Authenticated users can view all micro plans"
  ON micro_plans FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for workout_sessions
CREATE POLICY "Users can view own workout sessions"
  ON workout_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout sessions"
  ON workout_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout sessions"
  ON workout_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout sessions"
  ON workout_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for pain_tracking
CREATE POLICY "Users can view own pain tracking"
  ON pain_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pain tracking"
  ON pain_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pain tracking"
  ON pain_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pain tracking"
  ON pain_tracking FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for adherence_stats
CREATE POLICY "Users can view own adherence stats"
  ON adherence_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own adherence stats"
  ON adherence_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own adherence stats"
  ON adherence_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own adherence stats"
  ON adherence_stats FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);