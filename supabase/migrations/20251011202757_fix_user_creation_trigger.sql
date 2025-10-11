/*
  # Fix User Creation Trigger

  1. Changes
    - Split trigger logic into two parts:
      - BEFORE INSERT: Auto-confirm email only
      - AFTER INSERT: Create profile and leaderboard entries
    - This prevents database errors when creating new users
  
  2. Security
    - Users can access the app immediately after signup
    - Profile and leaderboard entries created automatically
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_after ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_before();
DROP FUNCTION IF EXISTS public.handle_new_user_after();

-- Function to auto-confirm email (runs BEFORE INSERT)
CREATE OR REPLACE FUNCTION public.handle_new_user_before()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the email by setting email_confirmed_at
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create profile and leaderboard (runs AFTER INSERT)
CREATE OR REPLACE FUNCTION public.handle_new_user_after()
RETURNS TRIGGER AS $$
BEGIN
  -- Create leaderboard entry
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

-- Create BEFORE trigger to auto-confirm email
CREATE TRIGGER on_auth_user_created_before
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_before();

-- Create AFTER trigger to create related records
CREATE TRIGGER on_auth_user_created_after
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_after();
