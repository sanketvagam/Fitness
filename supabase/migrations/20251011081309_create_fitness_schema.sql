/*
  # FitForge Database Schema

  ## Overview
  This migration creates the complete database schema for the FitForge fitness tracking application,
  including user profiles, goals, activities, meals, habits, achievements, challenges, and social features.

  ## Tables Created
  
  ### 1. profiles
  - Extends auth.users with fitness-specific profile data
  - Fields: name, age, gender, weight, height, activity_level, fitness_goal
  - One-to-one relationship with auth.users
  
  ### 2. fitness_goals
  - Stores user fitness goals (weight loss, running, gym frequency, steps)
  - Fields: type, title, target, current, unit, deadline, category
  - Links to auth.users via user_id
  
  ### 3. activities
  - Tracks daily activities and progress updates
  - Fields: goal_id, type (workout/weight/steps/distance), value, notes
  - Links to fitness_goals and auth.users
  
  ### 4. meals
  - Stores meal logging data with macronutrients
  - Fields: name, type (breakfast/lunch/dinner/snack), calories, protein, carbs, fats, notes
  - Links to auth.users via user_id
  
  ### 5. habits
  - Tracks daily habit completion
  - Fields: name, description, category, target_days, icon, color
  - Links to auth.users via user_id
  
  ### 6. habit_completions
  - Records when habits are completed
  - Fields: habit_id, completed_date
  - Links to habits and auth.users
  
  ### 7. weight_entries
  - Tracks weight measurements over time
  - Fields: weight, date
  - Links to auth.users via user_id
  
  ### 8. sleep_entries
  - Tracks sleep duration
  - Fields: hours, date
  - Links to auth.users via user_id
  
  ### 9. badges
  - Defines available achievement badges
  - Fields: name, description, icon, category, requirement
  - Shared across all users
  
  ### 10. user_achievements
  - Tracks which badges users have earned
  - Fields: badge_id, progress, unlocked_at
  - Links to badges and auth.users
  
  ### 11. challenges
  - Defines community challenges
  - Fields: name, description, goal, unit, duration, start_date, end_date, category
  - Shared across all users
  
  ### 12. user_challenges
  - Tracks user participation in challenges
  - Fields: challenge_id, progress, joined_at
  - Links to challenges and auth.users
  
  ### 13. leaderboard
  - Stores user rankings and scores
  - Fields: username, avatar, score, level, badges_count
  - Links to auth.users via user_id

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict users to their own data
  - Public read access for badges and challenges
  - Authenticated users can view leaderboard

  ## Important Notes
  - All timestamps use timestamptz for timezone support
  - Foreign keys use ON DELETE CASCADE for data cleanup
  - Indexes added for frequently queried columns
  - Default values set for common fields
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL CHECK (age > 0 AND age < 150),
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  weight numeric(5,2) NOT NULL CHECK (weight > 0),
  height numeric(5,2) NOT NULL CHECK (height > 0),
  activity_level text NOT NULL CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very-active')),
  fitness_goal text NOT NULL CHECK (fitness_goal IN ('lose-weight', 'maintain', 'gain-muscle')),
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fitness_goals table
CREATE TABLE IF NOT EXISTS fitness_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('weight-loss', 'run-distance', 'gym-frequency', 'daily-steps')),
  title text NOT NULL,
  target numeric(10,2) NOT NULL CHECK (target > 0),
  current numeric(10,2) DEFAULT 0 CHECK (current >= 0),
  unit text NOT NULL,
  deadline date NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES fitness_goals(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('workout', 'weight', 'steps', 'distance')),
  value numeric(10,2) NOT NULL CHECK (value > 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  calories integer NOT NULL CHECK (calories >= 0),
  protein numeric(5,2) NOT NULL CHECK (protein >= 0),
  carbs numeric(5,2) NOT NULL CHECK (carbs >= 0),
  fats numeric(5,2) NOT NULL CHECK (fats >= 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  target_days integer NOT NULL DEFAULT 7 CHECK (target_days > 0),
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

-- Create weight_entries table
CREATE TABLE IF NOT EXISTS weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight numeric(5,2) NOT NULL CHECK (weight > 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create sleep_entries table
CREATE TABLE IF NOT EXISTS sleep_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hours numeric(4,2) NOT NULL CHECK (hours >= 0 AND hours <= 24),
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create badges table (shared across all users)
CREATE TABLE IF NOT EXISTS badges (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL CHECK (category IN ('fitness', 'nutrition', 'streak', 'milestone', 'social')),
  requirement integer NOT NULL CHECK (requirement > 0),
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id text NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  progress integer DEFAULT 0 CHECK (progress >= 0),
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create challenges table (shared across all users)
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  goal integer NOT NULL CHECK (goal > 0),
  unit text NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  start_date date NOT NULL,
  end_date date NOT NULL,
  category text NOT NULL CHECK (category IN ('calories', 'steps', 'workouts', 'distance')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress integer DEFAULT 0 CHECK (progress >= 0),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username text NOT NULL,
  avatar text,
  score integer DEFAULT 0 CHECK (score >= 0),
  level integer DEFAULT 1 CHECK (level > 0),
  badges_count integer DEFAULT 0 CHECK (badges_count >= 0),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fitness_goals_user_id ON fitness_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_goal_id ON activities(goal_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(date);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_entries_user_id ON sleep_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fitness goals policies
CREATE POLICY "Users can view own goals"
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

-- Activities policies
CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Habit completions policies
CREATE POLICY "Users can view own habit completions"
  ON habit_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit completions"
  ON habit_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit completions"
  ON habit_completions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Weight entries policies
CREATE POLICY "Users can view own weight entries"
  ON weight_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries"
  ON weight_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight entries"
  ON weight_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries"
  ON weight_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sleep entries policies
CREATE POLICY "Users can view own sleep entries"
  ON sleep_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep entries"
  ON sleep_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep entries"
  ON sleep_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep entries"
  ON sleep_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Badges policies (public read)
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Challenges policies (public read)
CREATE POLICY "Anyone can view challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

-- User challenges policies
CREATE POLICY "Users can view own challenge participation"
  ON user_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges"
  ON user_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON user_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave challenges"
  ON user_challenges FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Leaderboard policies (authenticated read)
CREATE POLICY "Authenticated users can view leaderboard"
  ON leaderboard FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own leaderboard entry"
  ON leaderboard FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leaderboard entry"
  ON leaderboard FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default badges
INSERT INTO badges (id, name, description, icon, category, requirement) VALUES
  ('first-goal', 'Goal Setter', 'Create your first fitness goal', 'Target', 'milestone', 1),
  ('goal-master', 'Goal Master', 'Complete 5 fitness goals', 'Award', 'milestone', 5),
  ('week-streak', 'Week Warrior', 'Maintain a 7-day streak', 'Flame', 'streak', 7),
  ('month-streak', 'Monthly Master', 'Maintain a 30-day streak', 'Trophy', 'streak', 30),
  ('nutrition-novice', 'Nutrition Novice', 'Log 10 meals', 'Utensils', 'nutrition', 10),
  ('workout-warrior', 'Workout Warrior', 'Complete 20 workouts', 'Dumbbell', 'fitness', 20),
  ('social-butterfly', 'Social Butterfly', 'Join 3 challenges', 'Users', 'social', 3)
ON CONFLICT (id) DO NOTHING;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.leaderboard (user_id, username, avatar, score, level, badges_count)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    0,
    1,
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create leaderboard entry on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update leaderboard when achievements change
CREATE OR REPLACE FUNCTION public.update_leaderboard()
RETURNS trigger AS $$
BEGIN
  UPDATE leaderboard
  SET 
    badges_count = (SELECT COUNT(*) FROM user_achievements WHERE user_id = NEW.user_id AND unlocked_at IS NOT NULL),
    score = score + 100,
    level = GREATEST(1, (SELECT COUNT(*) FROM user_achievements WHERE user_id = NEW.user_id AND unlocked_at IS NOT NULL) / 3),
    updated_at = now()
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update leaderboard when badge is unlocked
DROP TRIGGER IF EXISTS on_achievement_unlocked ON user_achievements;
CREATE TRIGGER on_achievement_unlocked
  AFTER UPDATE OF unlocked_at ON user_achievements
  FOR EACH ROW
  WHEN (OLD.unlocked_at IS NULL AND NEW.unlocked_at IS NOT NULL)
  EXECUTE FUNCTION public.update_leaderboard();