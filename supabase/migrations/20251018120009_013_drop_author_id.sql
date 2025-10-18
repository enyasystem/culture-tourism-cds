-- Migration: Drop author_id from stories and related constraints
-- NOTE: This is destructive. BACK UP your database before applying.
-- This migration removes the author_id column, its foreign key constraint,
-- and any related indexes. If you rely on author_id for authorization or
-- auditing, create an alternative before applying.

BEGIN;

-- Drop foreign key constraint if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'stories' AND tc.constraint_type = 'FOREIGN KEY' AND kcu.column_name = 'author_id'
  ) THEN
    ALTER TABLE public.stories DROP CONSTRAINT IF EXISTS stories_author_id_fkey;
  END IF;
END$$;

-- Drop index if exists
DROP INDEX IF EXISTS idx_stories_author_id;

-- Drop the column if it exists
ALTER TABLE public.stories DROP COLUMN IF EXISTS author_id;

COMMIT;

-- ROLLBACK/restore guidance:
-- 1) If you need to restore the column, you must recreate it and re-populate
--    any values from backups or another table (for example, from a profiles
--    or audit table). Example to add back the column (no data restoration):
--
-- ALTER TABLE public.stories ADD COLUMN author_id uuid;
-- ALTER TABLE public.stories ADD CONSTRAINT stories_author_id_fkey FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE SET NULL;
-- CREATE INDEX idx_stories_author_id ON stories(author_id);
--
-- 2) If you plan to backfill author info before dropping, run a SELECT to
--    verify backfilled values and then remove the column.
--
-- IMPORTANT: If your production PostgREST instance still references
-- author_id in its schema cache, you may need to restart/reload PostgREST or
-- contact your provider to refresh the schema cache after applying this
-- migration.
