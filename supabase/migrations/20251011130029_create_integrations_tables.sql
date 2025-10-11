/*
  # Create Integrations and Sync History Tables

  1. New Tables
    - `integrations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `provider` (text)
      - `access_token` (text, encrypted)
      - `refresh_token` (text, encrypted)
      - `is_active` (boolean)
      - `last_sync` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sync_history`
      - `id` (uuid, primary key)
      - `integration_id` (uuid, references integrations)
      - `status` (text)
      - `activities_synced` (integer)
      - `error_message` (text)
      - `synced_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own data
*/

CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL,
  access_token text,
  refresh_token text,
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS integrations_user_id_idx ON integrations(user_id);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own integrations"
  ON integrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integrations"
  ON integrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integrations"
  ON integrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own integrations"
  ON integrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS sync_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id uuid REFERENCES integrations(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  activities_synced integer DEFAULT 0,
  error_message text,
  synced_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sync_history_integration_id_idx ON sync_history(integration_id);

ALTER TABLE sync_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sync history"
  ON sync_history FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM integrations
      WHERE integrations.id = sync_history.integration_id
      AND integrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sync history"
  ON sync_history FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM integrations
      WHERE integrations.id = sync_history.integration_id
      AND integrations.user_id = auth.uid()
    )
  );