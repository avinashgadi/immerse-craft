-- Update destination images for the 10 specific destinations
-- This migration updates the image_url field for the 10 destinations with their specific local images

UPDATE public.destinations 
SET image_url = '/src/assets/dest-mount-fuji.jpg'
WHERE name = 'Mount Fuji';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-taj-mahal.jpg'
WHERE name = 'Taj Mahal';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-angkor-wat.jpg'
WHERE name = 'Angkor Wat';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-great-wall.jpg'
WHERE name = 'Great Wall of China';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-tokyo-shibuya.jpg'
WHERE name = 'Tokyo Shibuya';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-petra.jpg'
WHERE name = 'Petra';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-borobudur.jpg'
WHERE name = 'Borobudur';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-bagan-temples.jpg'
WHERE name = 'Bagan Temples';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-ha-long-bay.jpg'
WHERE name = 'Ha Long Bay';

UPDATE public.destinations 
SET image_url = '/src/assets/dest-jeju-island.jpg'
WHERE name = 'Jeju Island';

-- Mark these 10 destinations as available for viewing
UPDATE public.destinations 
SET available = true
WHERE name IN (
  'Mount Fuji',
  'Taj Mahal', 
  'Angkor Wat',
  'Great Wall of China',
  'Tokyo Shibuya',
  'Petra',
  'Borobudur',
  'Bagan Temples',
  'Ha Long Bay',
  'Jeju Island'
);
