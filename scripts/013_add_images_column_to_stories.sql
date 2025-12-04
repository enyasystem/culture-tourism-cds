-- Migration: add images column to stories so multiple image URLs can be stored
-- Using jsonb array to store image URLs (matches other JSON fields in the app)
ALTER TABLE IF EXISTS stories
  ADD COLUMN IF NOT EXISTS images jsonb;

-- Optional: migrate existing cover_image into images for rows that have it
-- This will keep existing cover_image values in images array for compatibility with older code
UPDATE stories
SET images = jsonb_build_array(cover_image)
WHERE images IS NULL AND cover_image IS NOT NULL;
