/*
  # Auto-confirm User Emails on Signup

  1. Changes
    - Update `handle_new_user()` function to automatically confirm user emails
    - Sets `email_confirmed_at` to NOW() so users can sign in immediately
    - No email confirmation required for new signups
  
  2. Security
    - Users can sign in immediately after signup
    - No email verification step required
*/

-- Update the function to auto-confirm emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the email
  NEW.email_confirmed_at = NOW();
  
  -- Create leaderboard entry
  INSERT INTO public.leaderboard (user_id, username, avatar, score, level, badges_count)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
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