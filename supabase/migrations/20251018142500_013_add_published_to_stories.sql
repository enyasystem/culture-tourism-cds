-- Migration: Add published column to stories and backfill from status
-- Adds a boolean `published` column if missing so policies referencing it work

ALTER TABLE IF EXISTS stories
  ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;

-- Backfill published from status if that column exists (avoid errors if not)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stories' AND column_name = 'status'
  ) THEN
    UPDATE stories SET published = (status = 'published') WHERE published IS NULL;
  END IF;
END$$;

-- Note: After applying this migration, PostgREST should pick up the new column
-- when the Supabase services are restarted or the schema cache is refreshed.
