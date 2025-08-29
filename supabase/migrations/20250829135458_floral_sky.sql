/*
  # Role-Based Authentication System Setup

  1. New Tables
    - `user_profiles` - Extended user information with roles
    - `user_roles` - Role definitions and permissions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure user profile management
    
  3. Functions
    - Auto-create user profile on signup
    - Role validation functions
    
  4. Triggers
    - Automatic profile creation
    - Email verification tracking
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('attendee', 'organizer', 'sponsor');

-- Create user_profiles table to extend Supabase auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL,
  email_verified boolean DEFAULT false,
  profile_completed boolean DEFAULT false,
  avatar_url text,
  company text,
  job_title text,
  phone text,
  bio text,
  website text,
  linkedin_url text,
  twitter_url text,
  preferences jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create role permissions table
CREATE TABLE IF NOT EXISTS user_role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  permission text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission)
);

-- Insert default role permissions
INSERT INTO user_role_permissions (role, permission, description) VALUES
  ('attendee', 'view_events', 'Can view and register for events'),
  ('attendee', 'manage_registrations', 'Can manage own event registrations'),
  ('attendee', 'view_profile', 'Can view and edit own profile'),
  ('attendee', 'network', 'Can connect with other attendees'),
  
  ('organizer', 'create_events', 'Can create and manage events'),
  ('organizer', 'manage_attendees', 'Can manage event attendees'),
  ('organizer', 'view_analytics', 'Can view event analytics'),
  ('organizer', 'manage_speakers', 'Can manage event speakers'),
  ('organizer', 'manage_sponsors', 'Can manage event sponsors'),
  
  ('sponsor', 'manage_booth', 'Can customize virtual booth'),
  ('sponsor', 'capture_leads', 'Can capture and manage leads'),
  ('sponsor', 'view_analytics', 'Can view sponsorship analytics'),
  ('sponsor', 'interact_attendees', 'Can interact with attendees');

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND email = 'tanmay365210@gmail.com'
    )
  );

-- RLS Policies for role permissions (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view role permissions"
  ON user_role_permissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (
    id,
    email,
    full_name,
    role,
    email_verified
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'attendee'),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Function to update email verification status
CREATE OR REPLACE FUNCTION update_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE user_profiles 
    SET email_verified = true, updated_at = now()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update email verification
DROP TRIGGER IF EXISTS update_email_verification_trigger ON auth.users;
CREATE TRIGGER update_email_verification_trigger
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION update_email_verification();

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  SELECT role INTO user_role_result
  FROM user_profiles
  WHERE id = user_id;
  
  RETURN user_role_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(user_id uuid, permission_name text)
RETURNS boolean AS $$
DECLARE
  user_role_val user_role;
  has_permission boolean DEFAULT false;
BEGIN
  -- Get user role
  SELECT role INTO user_role_val
  FROM user_profiles
  WHERE id = user_id;
  
  -- Check if role has permission
  SELECT EXISTS(
    SELECT 1 FROM user_role_permissions
    WHERE role = user_role_val AND permission = permission_name
  ) INTO has_permission;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email_verified ON user_profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_user_role_permissions_role ON user_role_permissions(role);

-- Update function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();