/*
  # Add capacity column to events table

  1. Schema Changes
    - Add `capacity` column to `events` table
    - Set default value to match max_attendees where available
    - Add index for performance

  2. Data Migration
    - Update existing events to use max_attendees value as capacity
    - Set reasonable defaults for events without max_attendees

  3. Security
    - No RLS changes needed as this is just adding a column
*/

-- Add capacity column to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'capacity'
  ) THEN
    ALTER TABLE events ADD COLUMN capacity integer DEFAULT 100;
  END IF;
END $$;

-- Update existing events to set capacity based on max_attendees
UPDATE events 
SET capacity = COALESCE(max_attendees, 100)
WHERE capacity IS NULL;

-- Add index for capacity column for better query performance
CREATE INDEX IF NOT EXISTS idx_events_capacity ON events(capacity);

-- Add constraint to ensure capacity is positive
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'events' AND constraint_name = 'events_capacity_positive'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_capacity_positive CHECK (capacity > 0);
  END IF;
END $$;