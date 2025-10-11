/*
  # Update Activity Types to Support New Categories

  ## Changes
  1. Updates the activities table to support new activity types
     - Adds 'running' as a valid activity type
     - Adds 'swimming' as a valid activity type  
     - Adds 'exercise' as a valid activity type
     - Keeps existing types: 'workout', 'weight', 'steps', 'distance'
  
  ## New Activity Types
  - `running` - For running activities (km)
  - `swimming` - For swimming activities (laps)
  - `exercise` - For personalized timed exercises (minutes)
  
  ## Security
  - No changes to RLS policies
  - CHECK constraint updated to include new types
*/

-- Drop the existing CHECK constraint
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_type_check;

-- Add new CHECK constraint with expanded activity types
ALTER TABLE activities ADD CONSTRAINT activities_type_check 
  CHECK (type IN ('workout', 'weight', 'steps', 'distance', 'running', 'swimming', 'exercise'));