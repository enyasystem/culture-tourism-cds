-- Migration: Create stories table for admin-managed stories
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text,
  body text,
  published boolean DEFAULT false,
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable row level security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Policy: allow public to view published stories
-- Create the policy only when a suitable column exists. Prefer `published`,
-- fall back to `status = 'published'` if that is present. This makes the
-- migration resilient when multiple schema variants exist in different
-- environments.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'published'
  ) THEN
    EXECUTE 'CREATE POLICY "public_can_view_published_stories" ON stories FOR SELECT USING (published = true)';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name = 'stories' AND column_name = 'status'
  ) THEN
    EXECUTE 'CREATE POLICY "public_can_view_published_stories" ON stories FOR SELECT USING (status = ''published'')';
  ELSE
    RAISE NOTICE 'Skipping creation of public_can_view_published_stories: no published or status column found on stories';
  END IF;
END$$;

-- Allow the Supabase service role (server) to INSERT/UPDATE/DELETE regardless of RLS
-- Supabase service role JWT will have claim: role = "service_role"
CREATE POLICY "service_role_full_access" ON stories
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Optional: allow authenticated users to INSERT (adjust as needed)
-- CREATE POLICY "authenticated_can_insert" ON stories
--   FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');