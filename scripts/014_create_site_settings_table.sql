-- 014_create_site_settings_table.sql

CREATE TABLE IF NOT EXISTS site_settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Insert default hero_images key if not exists
INSERT INTO site_settings (key, value)
SELECT 'hero_images', '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE key = 'hero_images');
