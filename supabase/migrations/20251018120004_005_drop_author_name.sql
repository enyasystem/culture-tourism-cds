-- Migration: Drop author_name column from stories
-- Created: 2025-10-18
-- Note: This migration drops the `author_name` column from public.stories.
-- It's destructive: make a DB backup before running in production.
-- Optional: run the backfill steps below before running this migration if you want to preserve names.

-- Safe check: only drop if the column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'stories'
          AND column_name = 'author_name'
    ) THEN
        ALTER TABLE public.stories DROP COLUMN author_name;
    ELSE
        RAISE NOTICE 'Column public.stories.author_name does not exist; skipping DROP.';
    END IF;
END$$;

-- Rollback guidance (manual):
-- To rollback, re-add the column and optionally repopulate from profiles:
-- ALTER TABLE public.stories ADD COLUMN author_name TEXT;
-- UPDATE public.stories s
-- SET author_name = p.full_name
-- FROM public.profiles p
-- WHERE s.author_id IS NOT NULL AND p.id = s.author_id
--   AND (s.author_name IS NULL OR s.author_name = '');

-- End of migration
