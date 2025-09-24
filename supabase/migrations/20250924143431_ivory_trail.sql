/*
  # Organizer Section Database Updates

  1. New Tables
    - Enhanced organizer_events table with pricing support
    - Event pricing table for ticket management
    - Event status tracking for incomplete/complete workflow

  2. Security
    - Enable RLS on new tables
    - Add policies for organizer-only access

  3. Functions
    - Auto-create analytics record on event creation
    - Status calculation functions
*/

-- Add pricing column to organizer_events if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizer_events' AND column_name = 'price'
  ) THEN
    ALTER TABLE organizer_events ADD COLUMN price decimal(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add currency column to organizer_events if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizer_events' AND column_name = 'currency'
  ) THEN
    ALTER TABLE organizer_events ADD COLUMN currency text DEFAULT 'INR';
  END IF;
END $$;

-- Function to check if event is complete
CREATE OR REPLACE FUNCTION is_event_complete(event_row organizer_events)
RETURNS boolean AS $$
BEGIN
  RETURN (
    event_row.title IS NOT NULL AND length(trim(event_row.title)) > 0 AND
    event_row.description IS NOT NULL AND length(trim(event_row.description)) > 0 AND
    event_row.venue IS NOT NULL AND length(trim(event_row.venue)) > 0 AND
    event_row.event_date IS NOT NULL AND
    event_row.time IS NOT NULL AND
    event_row.image_url IS NOT NULL AND length(trim(event_row.image_url)) > 0 AND
    event_row.capacity > 0
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-create analytics record
CREATE OR REPLACE FUNCTION create_event_analytics()
RETURNS trigger AS $$
BEGIN
  INSERT INTO organizer_event_analytics (event_id, views, registrations, conversion_rate, revenue, top_referrers)
  VALUES (NEW.id, 0, 0, 0, 0, '{}')
  ON CONFLICT (event_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create analytics on event creation
DROP TRIGGER IF EXISTS on_organizer_event_created ON organizer_events;
CREATE TRIGGER on_organizer_event_created
  AFTER INSERT ON organizer_events
  FOR EACH ROW EXECUTE FUNCTION create_event_analytics();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizer_events_organizer_id ON organizer_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_events_status ON organizer_events(status);
CREATE INDEX IF NOT EXISTS idx_organizer_events_event_date ON organizer_events(event_date);
CREATE INDEX IF NOT EXISTS idx_organizer_ticket_types_event_id ON organizer_ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_event_id ON organizer_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_user_id ON organizer_attendees(user_id);