-- Migration: Create pages table for admin-managed pages
CREATE TABLE IF NOT EXISTS pages (
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

-- Enable row level security (we will rely on server-side admin APIs using
-- the service role key for admin writes and reads where appropriate).
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- A simple example policy allowing authenticated users to SELECT published
-- pages. Admin APIs will use the service role or secure functions for full access.
CREATE POLICY "public_can_view_published_pages" ON pages
  FOR SELECT USING (published = true);
