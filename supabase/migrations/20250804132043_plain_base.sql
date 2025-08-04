/*
  # Admin Panel Database Schema

  1. New Tables
    - `app_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `username` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `event_name` (text)
      - `event_type` (text)
      - `expected_attendees` (integer)
      - `event_date` (date)
      - `budget` (text)
      - `description` (text)
      - `location_address` (text)
      - `location_lat` (decimal)
      - `location_lng` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
*/

-- Create app_users table
CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES app_users(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_type text NOT NULL DEFAULT 'conference',
  expected_attendees integer DEFAULT 50,
  event_date date,
  budget text,
  description text,
  location_address text,
  location_lat decimal,
  location_lng decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for app_users
CREATE POLICY "Users can read own data"
  ON app_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data"
  ON app_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON app_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for events
CREATE POLICY "Users can read own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (user_id::text = auth.uid()::text);

-- Admin policies (allow admin to access all data)
CREATE POLICY "Admin can read all users"
  ON app_users
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'tanmay365210@gmail.com');

CREATE POLICY "Admin can read all events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'tanmay365210@gmail.com');

CREATE POLICY "Admin can update all events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'tanmay365210@gmail.com');

CREATE POLICY "Admin can delete all events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'tanmay365210@gmail.com');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();