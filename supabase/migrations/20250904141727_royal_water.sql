/*
  # Unified Authentication System

  1. New Tables
    - `app_users` - Unified user table for all user types
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `role` (enum: attendee, organizer, sponsor)
      - `full_name` (text)
      - `company` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on `app_users` table
    - Add policies for user access control
    - Create functions for password hashing and validation

  3. Functions
    - User registration function
    - User login validation function
    - Role-based access control
*/

-- Create enum for user roles
CREATE TYPE user_role_type AS ENUM ('attendee', 'organizer', 'sponsor');

-- Create unified users table
CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role user_role_type NOT NULL,
  full_name text NOT NULL,
  company text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON app_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON app_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create function to hash passwords (simplified for demo)
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  -- In production, use proper password hashing like bcrypt
  -- This is a simplified version for demo purposes
  RETURN encode(digest(password || 'salt', 'sha256'), 'hex');
END;
$$;

-- Create function to register user
CREATE OR REPLACE FUNCTION register_user(
  p_email text,
  p_password text,
  p_role user_role_type,
  p_full_name text,
  p_company text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  existing_user app_users;
  new_user app_users;
BEGIN
  -- Check if email already exists
  SELECT * INTO existing_user FROM app_users WHERE email = p_email;
  
  IF existing_user.id IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email already exists in system'
    );
  END IF;
  
  -- Create new user
  INSERT INTO app_users (email, password_hash, role, full_name, company)
  VALUES (p_email, hash_password(p_password), p_role, p_full_name, p_company)
  RETURNING * INTO new_user;
  
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', new_user.id,
      'email', new_user.email,
      'role', new_user.role,
      'full_name', new_user.full_name,
      'company', new_user.company
    )
  );
END;
$$;

-- Create function to validate login
CREATE OR REPLACE FUNCTION validate_login(
  p_email text,
  p_password text
)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  user_record app_users;
BEGIN
  -- Find user by email
  SELECT * INTO user_record 
  FROM app_users 
  WHERE email = p_email AND is_active = true;
  
  IF user_record.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid email or password'
    );
  END IF;
  
  -- Validate password
  IF user_record.password_hash != hash_password(p_password) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid email or password'
    );
  END IF;
  
  -- Update last login
  UPDATE app_users 
  SET updated_at = now() 
  WHERE id = user_record.id;
  
  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', user_record.id,
      'email', user_record.email,
      'role', user_record.role,
      'full_name', user_record.full_name,
      'company', user_record.company
    )
  );
END;
$$;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_role ON app_users(role);
CREATE INDEX IF NOT EXISTS idx_app_users_active ON app_users(is_active);