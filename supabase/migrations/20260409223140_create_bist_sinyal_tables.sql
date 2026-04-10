/*
  # BİST Sinyal — Initial Schema

  ## Summary
  Creates the core tables required for the BİST Sinyal mobile application.

  ## New Tables

  ### user_profiles
  - Stores extended user data beyond Supabase Auth
  - Tracks subscription status (trial / active / inactive)
  - Links to auth.users via id (UUID)

  ### notification_settings
  - Per-user notification preferences
  - Controls which signal types trigger push notifications
  - Linked to user_profiles via user_id

  ## Security
  - RLS enabled on all tables
  - Users can only read/update their own data
  - INSERT allowed for authenticated users (for first-time setup)
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  subscription_status text NOT NULL DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'inactive')),
  subscription_end_date timestamptz DEFAULT NULL,
  trial_end_date timestamptz DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  strong_buy_alert boolean NOT NULL DEFAULT true,
  target_price_alert boolean NOT NULL DEFAULT true,
  stop_loss_alert boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification settings"
  ON notification_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
  ON notification_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
  ON notification_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_name = 'set_notification_settings_updated_at'
  ) THEN
    CREATE TRIGGER set_notification_settings_updated_at
      BEFORE UPDATE ON notification_settings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
