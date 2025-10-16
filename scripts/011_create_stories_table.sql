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
CREATE POLICY "public_can_view_published_stories" ON stories
  FOR SELECT USING (published = true);