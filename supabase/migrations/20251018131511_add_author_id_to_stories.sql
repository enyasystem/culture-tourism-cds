-- Migration: Add author_id to stories
-- Adds a nullable author_id column referencing auth.users(id) so stories can record who created them.

ALTER TABLE IF EXISTS stories
  ADD COLUMN IF NOT EXISTS author_id uuid;

-- Add foreign key constraint to auth.users (supabase auth)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'stories' AND tc.constraint_type = 'FOREIGN KEY' AND kcu.column_name = 'author_id'
  ) THEN
    ALTER TABLE stories
      ADD CONSTRAINT stories_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Create an index on author_id to speed up lookups
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);

-- Note: After applying this migration, restart PostgREST / Supabase API to refresh the schema cache if you still see PGRST204 errors.
