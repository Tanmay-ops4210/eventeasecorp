/*
  # Complete Authentication and Database Setup

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `events` - Event management for organizers
    - `organizer_events` - Simplified event table for organizers
    - `organizer_ticket_types` - Ticket management
    - `organizer_attendees` - Attendee management
    - `organizer_event_analytics` - Event analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Add helper functions for authentication

  3. Triggers
    - Auto-create profiles on user signup
    - Update timestamps automatically
    - Create analytics records for new events
*/

-- Helper function to get current user ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user exists
CREATE OR REPLACE FUNCTION user_exists()
RETURNS boolean AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, role, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee'),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create event analytics
CREATE OR REPLACE FUNCTION create_event_analytics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.organizer_event_analytics (event_id, views, registrations, conversion_rate, revenue, top_referrers)
  VALUES (NEW.id, 0, 0, 0, 0, '{}');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update analytics on registration
CREATE OR REPLACE FUNCTION update_analytics_on_registration()
RETURNS trigger AS $$
BEGIN
  UPDATE public.organizer_event_analytics 
  SET 
    registrations = registrations + 1,
    conversion_rate = CASE 
      WHEN views > 0 THEN (registrations + 1) * 100.0 / views 
      ELSE 0 
    END,
    updated_at = now()
  WHERE event_id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Create events table (main events table)
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
  updated_at timestamptz DEFAULT now(),
  price numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'INR'
);

-- Create ticket types table
CREATE TABLE IF NOT EXISTS organizer_ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES organizer_events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) DEFAULT 0,
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
  event_id uuid UNIQUE REFERENCES organizer_events(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  registrations integer DEFAULT 0,
  conversion_rate numeric(5,2) DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
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
  rating numeric(3,2) DEFAULT 0,
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

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Events policies (main events table)
CREATE POLICY "Anyone can read published events"
  ON events FOR SELECT
  TO authenticated
  USING (
    (status = 'published' AND visibility = 'public') OR 
    (organizer_id = auth.uid()) OR 
    is_admin_user()
  );

CREATE POLICY "Organizers can manage own events"
  ON events FOR ALL
  TO authenticated
  USING ((organizer_id = auth.uid()) OR is_admin_user())
  WITH CHECK ((organizer_id = auth.uid()) OR is_admin_user());

-- Organizer events policies
CREATE POLICY "Organizers can create events"
  ON organizer_events FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can read own events"
  ON organizer_events FOR SELECT
  TO authenticated
  USING ((organizer_id = auth.uid()) OR is_admin_user());

CREATE POLICY "Organizers can update own events"
  ON organizer_events FOR UPDATE
  TO authenticated
  USING ((organizer_id = auth.uid()) OR is_admin_user())
  WITH CHECK ((organizer_id = auth.uid()) OR is_admin_user());

CREATE POLICY "Organizers can delete own events"
  ON organizer_events FOR DELETE
  TO authenticated
  USING ((organizer_id = auth.uid()) OR is_admin_user());

-- Ticket types policies
CREATE POLICY "Organizers can manage tickets for own events"
  ON organizer_ticket_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE organizer_events.id = organizer_ticket_types.event_id 
      AND ((organizer_events.organizer_id = auth.uid()) OR is_admin_user())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE organizer_events.id = organizer_ticket_types.event_id 
      AND ((organizer_events.organizer_id = auth.uid()) OR is_admin_user())
    )
  );

-- Attendees policies
CREATE POLICY "Organizers can manage attendees for own events"
  ON organizer_attendees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE organizer_events.id = organizer_attendees.event_id 
      AND ((organizer_events.organizer_id = auth.uid()) OR is_admin_user())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE organizer_events.id = organizer_attendees.event_id 
      AND ((organizer_events.organizer_id = auth.uid()) OR is_admin_user())
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
      WHERE organizer_events.id = organizer_event_analytics.event_id 
      AND ((organizer_events.organizer_id = auth.uid()) OR is_admin_user())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE organizer_events.id = organizer_event_analytics.event_id 
      AND ((organizer_events.organizer_id = auth.uid()) OR is_admin_user())
    )
  );

-- Speakers policies
CREATE POLICY "Anyone can read speakers"
  ON speakers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage speakers"
  ON speakers FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Sponsors policies
CREATE POLICY "Anyone can read sponsors"
  ON sponsors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sponsors"
  ON sponsors FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_organizer_events_organizer_id ON organizer_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_events_status ON organizer_events(status);
CREATE INDEX IF NOT EXISTS idx_organizer_events_event_date ON organizer_events(event_date);
CREATE INDEX IF NOT EXISTS idx_organizer_ticket_types_event_id ON organizer_ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_event_id ON organizer_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_user_id ON organizer_attendees(user_id);

-- Create triggers
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON organizer_events
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON organizer_event_analytics
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create trigger for event analytics creation
CREATE TRIGGER on_organizer_event_created
  AFTER INSERT ON organizer_events
  FOR EACH ROW EXECUTE FUNCTION create_event_analytics();

-- Create trigger for attendee registration analytics
CREATE TRIGGER on_attendee_registered
  AFTER INSERT ON organizer_attendees
  FOR EACH ROW EXECUTE FUNCTION update_analytics_on_registration();

-- Insert sample speakers
INSERT INTO speakers (name, title, company, bio, image_url, expertise, location, rating, events_count, featured, social_links) VALUES
('Zawadi Thandwe', 'Chief Technology Officer', 'TechCorp Industries', 'Professional with 20 years of experience helping brands reach their goals.', 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Technology","Leadership","Innovation"}', 'San Francisco, CA', 4.9, 25, true, '{"linkedin": "https://linkedin.com/in/zawadi", "twitter": "https://twitter.com/zawadi"}'),
('Ejiro Rudo', 'Senior Product Manager', 'Innovation Labs', 'Skilled in problem solving, communication, and strategic thinking.', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Product Management","Strategy","Design"}', 'New York, NY', 4.8, 18, true, '{"linkedin": "https://linkedin.com/in/ejiro", "website": "https://ejiro.com"}'),
('Daniel Saoirse', 'Creative Director', 'Design Studio Pro', 'Dedicated to crafting innovative solutions throughout the year with change.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', '{"Design","Creativity","Innovation"}', 'Los Angeles, CA', 4.7, 22, false, '{"website": "https://daniel-design.com"}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample sponsors
INSERT INTO sponsors (name, logo_url, tier, website, description, contact_email) VALUES
('TechCorp Industries', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200', 'platinum', 'https://techcorp.com', 'Leading technology solutions provider', 'sponsor@techcorp.com'),
('Innovation Labs', 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200', 'gold', 'https://innovationlabs.com', 'Research and development company', 'contact@innovationlabs.com'),
('Design Studio Pro', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200', 'silver', 'https://designstudiopro.com', 'Creative design agency', 'hello@designstudiopro.com')
ON CONFLICT (id) DO NOTHING;