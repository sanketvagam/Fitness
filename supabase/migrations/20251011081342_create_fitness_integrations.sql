/*
  # Fitness Tracker Integrations Schema

  ## Overview
  This migration creates the necessary tables and policies for managing 
  fitness tracker integrations (Strava, Fitbit, Apple Health, etc.)

  ## New Tables

  ### `integrations`
  Stores connected fitness app integrations for each user
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users)
  - `provider` (text) - The fitness app name (strava, fitbit, etc.)
  - `provider_user_id` (text) - User ID from the provider
  - `access_token` (text) - Encrypted access token
  - `refresh_token` (text) - Encrypted refresh token
  - `expires_at` (timestamptz) - Token expiration time
  - `status` (text) - active, expired, disconnected
  - `last_sync` (timestamptz) - Last successful data sync
  - `settings` (jsonb) - Provider-specific settings
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `sync_history`
  Tracks all data sync operations
  - `id` (uuid, primary key)
  - `integration_id` (uuid, references integrations)
  - `user_id` (uuid, references auth.users)
  - `sync_type` (text) - manual, automatic, scheduled
  - `status` (text) - success, failed, partial
  - `activities_synced` (integer) - Number of activities imported
  - `error_message` (text) - Error details if failed
  - `started_at` (timestamptz)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own integrations and sync history
  - Access tokens are stored (in production these would be encrypted)
*/

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  provider_user_id text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disconnected')),
  last_sync timestamptz,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Create sync_history table
CREATE TABLE IF NOT EXISTS sync_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sync_type text DEFAULT 'manual' CHECK (sync_type IN ('manual', 'automatic', 'scheduled')),
  status text DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
  activities_synced integer DEFAULT 0,
  error_message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);
CREATE INDEX IF NOT EXISTS idx_sync_history_integration_id ON sync_history(integration_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_user_id ON sync_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_created_at ON sync_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for integrations table

-- Users can view their own integrations
CREATE POLICY "Users can view own integrations"
  ON integrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own integrations
CREATE POLICY "Users can insert own integrations"
  ON integrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own integrations
CREATE POLICY "Users can update own integrations"
  ON integrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own integrations
CREATE POLICY "Users can delete own integrations"
  ON integrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for sync_history table

-- Users can view their own sync history
CREATE POLICY "Users can view own sync history"
  ON sync_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own sync history
CREATE POLICY "Users can insert own sync history"
  ON sync_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();