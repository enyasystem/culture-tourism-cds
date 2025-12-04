-- Direct update to set the cover image for the Jos Wildlife Park story
UPDATE public.stories
SET cover_image = '/visit-wildlife-renamed/jos-wildlife-20251204-090248-2-1.jpg'
WHERE slug = 'a-day-at-jos-wildlife-park';
