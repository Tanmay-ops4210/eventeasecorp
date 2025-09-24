/*
  # Core Database Schema for EventEase Platform

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `events` - Main events table for all event data
    - `organizer_events` - Simplified organizer event management
    - `organizer_ticket_types` - Ticket types for organizer events
    - `organizer_attendees` - Attendee management for organizers
    - `organizer_event_analytics` - Analytics data for events
    - `speakers` - Speaker directory
    - `sponsors` - Sponsor information

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Ensure data isolation between users

  3. Functions
    - Auto-create profile on user signup
    - Role-based access functions
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'attendee' CHECK (role IN ('attendee', 'organizer', 'admin')),
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  company text,
  title text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table (main events)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  full_description text,
  category text DEFAULT 'conference',
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time,
  venue text NOT NULL,
  venue_address text,
  image_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  max_attendees integer DEFAULT 100,
  capacity integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organizer_events table (simplified for organizers)
CREATE TABLE IF NOT EXISTS organizer_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text DEFAULT 'conference',
  event_date date NOT NULL,
  time time NOT NULL,
  end_time time,
  venue text NOT NULL,
  capacity integer DEFAULT 100,
  image_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ticket types table
CREATE TABLE IF NOT EXISTS organizer_ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES organizer_events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  quantity integer DEFAULT 100,
  sold integer DEFAULT 0,
  sale_start timestamptz DEFAULT now(),
  sale_end timestamptz,
  is_active boolean DEFAULT true,
  benefits text[] DEFAULT '{}',
  restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create attendees table
CREATE TABLE IF NOT EXISTS organizer_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES organizer_events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_type_id uuid REFERENCES organizer_ticket_types(id),
  registration_date timestamptz DEFAULT now(),
  check_in_status text DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'checked-in', 'no-show')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  additional_info jsonb DEFAULT '{}'
);

-- Create event analytics table
CREATE TABLE IF NOT EXISTS organizer_event_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES organizer_events(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  registrations integer DEFAULT 0,
  conversion_rate decimal(5,2) DEFAULT 0,
  revenue decimal(10,2) DEFAULT 0,
  top_referrers text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create speakers table
CREATE TABLE IF NOT EXISTS speakers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text,
  company text,
  bio text,
  image_url text,
  expertise text[] DEFAULT '{}',
  location text,
  rating decimal(3,2) DEFAULT 0,
  events_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  social_links jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  tier text DEFAULT 'bronze' CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  website text,
  description text,
  contact_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Events policies (public read, organizer write)
CREATE POLICY "Anyone can read published events"
  ON events FOR SELECT
  TO authenticated
  USING (status = 'published' AND visibility = 'public');

CREATE POLICY "Organizers can manage own events"
  ON events FOR ALL
  TO authenticated
  USING (organizer_id = auth.uid());

-- Organizer events policies
CREATE POLICY "Organizers can read own events"
  ON organizer_events FOR SELECT
  TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can create events"
  ON organizer_events FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can update own events"
  ON organizer_events FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can delete own events"
  ON organizer_events FOR DELETE
  TO authenticated
  USING (organizer_id = auth.uid());

-- Ticket types policies
CREATE POLICY "Organizers can manage tickets for own events"
  ON organizer_ticket_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

-- Attendees policies
CREATE POLICY "Organizers can manage attendees for own events"
  ON organizer_attendees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own attendance records"
  ON organizer_attendees FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Analytics policies
CREATE POLICY "Organizers can view analytics for own events"
  ON organizer_event_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

-- Speakers policies (public read)
CREATE POLICY "Anyone can read speakers"
  ON speakers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage speakers"
  ON speakers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sponsors policies (public read)
CREATE POLICY "Anyone can read sponsors"
  ON sponsors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sponsors"
  ON sponsors FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'attendee')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON organizer_events
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON organizer_event_analytics
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert sample speakers data
INSERT INTO speakers (name, title, company, bio, image_url, expertise, location, rating, events_count, featured) VALUES
('ZAWADI THANDWE', 'Chief Technology Officer', 'TechCorp Industries', 'Professional with 20 years of experience helping brands reach their goals through innovative technology solutions.', 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['Technology', 'Leadership', 'Innovation'], 'San Francisco, CA', 4.9, 25, true),
('EJIRO RUDO', 'Senior Product Manager', 'Innovation Labs', 'Skilled in problem solving, communication, and strategic thinking with a focus on user-centered design.', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['Product Management', 'Strategy', 'Design'], 'New York, NY', 4.8, 18, true),
('DANIEL SAOIRSE', 'Creative Director', 'Design Studio Pro', 'Dedicated to crafting innovative solutions throughout the year with change-driven creativity.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY['Design', 'Creativity', 'Innovation'], 'Los Angeles, CA', 4.7, 22, false);

-- Insert sample sponsors data
INSERT INTO sponsors (name, logo_url, tier, website, description, contact_email) VALUES
('TechCorp Industries', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200', 'platinum', 'https://techcorp.com', 'Leading technology solutions provider specializing in enterprise software and cloud infrastructure.', 'contact@techcorp.com'),
('Innovation Labs', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200', 'gold', 'https://innovationlabs.com', 'Research and development company focused on breakthrough innovations in AI and machine learning.', 'hello@innovationlabs.com'),
('Design Studio Pro', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200', 'gold', 'https://designstudiopro.com', 'Creative design agency helping brands create memorable experiences through innovative design solutions.', 'info@designstudiopro.com');