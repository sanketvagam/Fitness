/*
  # Fix Profile Creation on User Signup

  1. Changes
    - Update `handle_new_user()` function to create BOTH leaderboard and profile entries
    - Profile is created with default values from user metadata
    - Ensures profile exists immediately after signup
  
  2. Security
    - No RLS changes needed
    - Trigger runs with elevated permissions to create initial records
*/

-- Drop and recreate the function to include profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create leaderboard entry
  INSERT INTO public.leaderboard (user_id, username, avatar, score, level, badges_count)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    0,
    1,
    0
  );
  
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
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    25,
    'other',
    70,
    170,
    'moderate',
    'maintain'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;