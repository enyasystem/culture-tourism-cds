-- Insert sample cultural sites
INSERT INTO public.cultural_sites (name, description, location, state, local_government, category, cultural_significance, is_featured) VALUES
('Jos Museum', 'A comprehensive museum showcasing the rich cultural heritage of the Plateau State and Nigeria as a whole.', 'Museum Street, Jos', 'Plateau', 'Jos North', 'historical', 'Houses artifacts from various Nigerian cultures and serves as a center for cultural education and preservation.', true),
('Shere Hills', 'Ancient hills with historical significance and beautiful landscapes, perfect for hiking and cultural exploration.', 'Shere Village, Jos', 'Plateau', 'Jos East', 'natural', 'Sacred hills with traditional significance to local communities, offering panoramic views of Jos city.', true),
('Nok Terracotta Site', 'Archaeological site famous for the ancient Nok culture terracotta sculptures dating back to 1000 BC.', 'Nok Village', 'Kaduna', 'Jaba', 'historical', 'Birthplace of the oldest known sculptural tradition in sub-Saharan Africa, representing advanced ancient civilization.', true),
('Kurra Falls', 'Spectacular waterfall surrounded by lush vegetation, ideal for nature lovers and cultural tourism.', 'Kurra Village', 'Plateau', 'Barkin Ladi', 'natural', 'Traditional site for local ceremonies and a symbol of natural beauty in Plateau State.', false);

-- Insert sample events
INSERT INTO public.events (title, description, event_type, location, state, local_government, start_date, end_date, is_featured) VALUES
('Jos Cultural Festival', 'Annual celebration of the diverse cultures of Plateau State featuring traditional dances, music, and crafts.', 'festival', 'Jos Township Stadium', 'Plateau', 'Jos North', '2024-12-15 10:00:00+01', '2024-12-17 18:00:00+01', true),
('Peace Building Workshop', 'Interactive workshop for corps members on conflict resolution and community peace building.', 'workshop', 'NYSC Secretariat Jos', 'Plateau', 'Jos North', '2024-11-20 09:00:00+01', '2024-11-20 16:00:00+01', true),
('Traditional Crafts Exhibition', 'Showcase of traditional crafts from various ethnic groups in the Middle Belt region.', 'conference', 'Jos Arts & Culture Center', 'Plateau', 'Jos North', '2024-11-30 10:00:00+01', '2024-12-02 17:00:00+01', false);

-- Insert sample stories (match current stories table schema: includes `slug`)
INSERT INTO public.stories (title, slug, body, summary, cover_image, published) VALUES
('My First Visit to Jos Museum', 'my-first-visit-to-jos-museum', 'Walking through the halls of Jos Museum was like taking a journey through time. The artifacts told stories of ancient civilizations, colonial history, and the rich cultural tapestry of Nigeria. As a corps member serving in Plateau State, this visit opened my eyes to the deep historical roots of the land I now call home...', 'A corps member''s transformative experience exploring the cultural treasures of Jos Museum.', '/national-museum-jos-cultural-artifacts.jpg', true),
('The Legend of Shere Hills', 'the-legend-of-shere-hills', 'Local elders speak of Shere Hills with reverence, sharing stories passed down through generations. According to tradition, these hills were once home to ancient spirits who protected the land. Today, as I climbed to the summit during my CDS assignment, I felt connected to this rich oral tradition...', 'Exploring the traditional stories and legends surrounding the sacred Shere Hills.', '/shere-hills-jos-plateau-landscape.jpg', true),
('Building Bridges: A Peace Initiative', 'building-bridges-a-peace-initiative', 'During my service year, I witnessed how cultural exchange can bridge divides. Our peace and tourism CDS group organized a cultural exchange program between different communities, and the results were remarkable...', 'How cultural tourism initiatives can promote peace and understanding between communities.', NULL, false);

-- Add Jos Wildlife Park site (sample)
INSERT INTO public.cultural_sites (name, description, location, state, local_government, category, cultural_significance, is_featured)
VALUES
('Jos Wildlife Park', 'Home to diverse wildlife species and natural rock formations unique to Plateau State. Perfect for nature walks, wildlife observation and photography.', 'Jos Wildlife Park Road, Jos', 'Plateau', 'Jos South', 'natural', 'Important local conservation area and popular destination for nature-based cultural tourism.', true);

-- Ensure `images` JSONB column exists on stories for multi-image stories (safe if already present)
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS images JSONB;

-- Insert a sample story representing a visit to the wildlife park with multiple pictures
INSERT INTO public.stories (title, slug, body, summary, images, cover_image, published)
VALUES
('A Day at Jos Wildlife Park', 'a-day-at-jos-wildlife-park', 'We spent the day exploring the trails at Jos Wildlife Park — spotting several species, taking photos of the rock formations, and learning about local conservation efforts. The visit highlighted the natural beauty of Plateau State and the importance of preserving these spaces for future generations.', 'A short photo-led story of a visit to Jos Wildlife Park.', ('["/jos-wildlife-park-plateau-state.jpg", "/shere-hills-jos-plateau-landscape.jpg", "/placeholder.jpg"]')::jsonb, '/jos-wildlife-park-plateau-state.jpg', true);
