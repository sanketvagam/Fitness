/*
  # Disable Email Confirmation Requirement

  1. Changes
    - Updates handle_new_user trigger to BEFORE INSERT to auto-confirm emails
    - Sets email_confirmed_at immediately upon user creation
    - Ensures users can login without email verification
  
  2. Security
    - Users can access the app immediately after signup
    - No email verification step required
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function that runs BEFORE insert to modify email confirmation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the email by setting email_confirmed_at
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at = NOW();
  END IF;
  
  -- Create leaderboard entry (runs after user is created)
  INSERT INTO public.leaderboard (user_id, username, avatar, score, level, badges_count)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    0,
    1,
    0
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create profile entry with default values
  INSERT INTO public.profiles (
    id,
    name,
    age,
    gender,
    weight,
    height,
    activity_level,
    fitness_goal
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    25,
    'other',
    70,
    170,
    'moderate',
    'maintain'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that runs BEFORE INSERT to allow modification
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
