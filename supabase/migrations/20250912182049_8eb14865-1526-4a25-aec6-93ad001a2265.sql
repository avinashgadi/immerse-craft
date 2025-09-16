-- Create destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  rating DECIMAL(3,2) DEFAULT 0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for destinations (public read)
CREATE POLICY "Anyone can view destinations" ON public.destinations FOR SELECT USING (true);

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample destinations (50+ destinations)
INSERT INTO public.destinations (name, description, country, region, category, image_url, price, duration_minutes, rating, latitude, longitude, featured) VALUES
-- Asia
('Angkor Wat', 'Ancient temple complex in Cambodia', 'Cambodia', 'Asia', 'Cultural', '/images/angkor-wat.jpg', 29.99, 45, 4.9, 13.4125, 103.8670, true),
('Tokyo Shibuya', 'Bustling urban district in Tokyo', 'Japan', 'Asia', 'Urban', '/images/tokyo.jpg', 34.99, 60, 4.8, 35.6598, 139.7006, true),
('Mount Fuji', 'Iconic mountain in Japan', 'Japan', 'Asia', 'Nature', '/images/fuji.jpg', 39.99, 50, 4.9, 35.3606, 138.7274, true),
('Great Wall of China', 'Historic fortification in China', 'China', 'Asia', 'Cultural', '/images/great-wall.jpg', 32.99, 55, 4.8, 40.4319, 116.5704, true),
('Taj Mahal', 'Ivory-white marble mausoleum', 'India', 'Asia', 'Cultural', '/images/taj-mahal.jpg', 27.99, 40, 4.9, 27.1751, 78.0421, true),
('Petra', 'Archaeological city in Jordan', 'Jordan', 'Asia', 'Cultural', '/images/petra.jpg', 35.99, 65, 4.8, 30.3285, 35.4444, false),
('Bagan Temples', 'Ancient temples in Myanmar', 'Myanmar', 'Asia', 'Cultural', '/images/bagan.jpg', 28.99, 45, 4.7, 21.1719, 94.8575, false),
('Borobudur', 'Buddhist temple in Indonesia', 'Indonesia', 'Asia', 'Cultural', '/images/borobudur.jpg', 26.99, 40, 4.8, -7.6079, 110.2038, false),
('Ha Long Bay', 'UNESCO World Heritage site in Vietnam', 'Vietnam', 'Asia', 'Nature', '/images/halong-bay.jpg', 31.99, 50, 4.7, 20.9101, 107.1839, false),
('Jeju Island', 'Volcanic island in South Korea', 'South Korea', 'Asia', 'Nature', '/images/jeju.jpg', 33.99, 55, 4.6, 33.4996, 126.5312, false),

-- Europe
('Swiss Alps', 'Mountain range in Switzerland', 'Switzerland', 'Europe', 'Nature', '/images/swiss-alps.jpg', 42.99, 50, 4.9, 46.5197, 8.5950, true),
('Eiffel Tower', 'Iron lattice tower in Paris', 'France', 'Europe', 'Cultural', '/images/eiffel-tower.jpg', 25.99, 30, 4.8, 48.8584, 2.2945, true),
('Colosseum', 'Ancient amphitheatre in Rome', 'Italy', 'Europe', 'Cultural', '/images/colosseum.jpg', 29.99, 45, 4.9, 41.8902, 12.4922, true),
('Santorini', 'Greek island in the Aegean Sea', 'Greece', 'Europe', 'Nature', '/images/santorini.jpg', 37.99, 60, 4.8, 36.3932, 25.4615, false),
('Neuschwanstein Castle', 'Fairy-tale castle in Germany', 'Germany', 'Europe', 'Cultural', '/images/neuschwanstein.jpg', 31.99, 40, 4.7, 47.5576, 10.7498, false),
('Stonehenge', 'Prehistoric monument in England', 'UK', 'Europe', 'Cultural', '/images/stonehenge.jpg', 24.99, 35, 4.6, 51.1789, -1.8262, false),
('Northern Lights', 'Aurora borealis in Iceland', 'Iceland', 'Europe', 'Nature', '/images/northern-lights.jpg', 49.99, 70, 4.9, 64.9631, -19.0208, false),
('Prague Castle', 'Historic castle complex in Czech Republic', 'Czech Republic', 'Europe', 'Cultural', '/images/prague-castle.jpg', 27.99, 45, 4.7, 50.0922, 14.4015, false),
('Sagrada Familia', 'Basilica in Barcelona, Spain', 'Spain', 'Europe', 'Cultural', '/images/sagrada-familia.jpg', 28.99, 40, 4.8, 41.4036, 2.1744, false),
('Norwegian Fjords', 'Deep glacial valleys in Norway', 'Norway', 'Europe', 'Nature', '/images/norwegian-fjords.jpg', 44.99, 65, 4.8, 62.1956, 5.3142, false),

-- Americas
('Machu Picchu', 'Ancient Incan citadel in Peru', 'Peru', 'Americas', 'Cultural', '/images/machu-picchu.jpg', 45.99, 60, 4.9, -13.1631, -72.5450, true),
('Grand Canyon', 'Natural wonder in Arizona, USA', 'USA', 'Americas', 'Nature', '/images/grand-canyon.jpg', 38.99, 55, 4.8, 36.1070, -112.1130, true),
('Statue of Liberty', 'Iconic statue in New York', 'USA', 'Americas', 'Cultural', '/images/statue-liberty.jpg', 22.99, 30, 4.7, 40.6892, -74.0445, false),
('Christ the Redeemer', 'Art Deco statue in Rio de Janeiro', 'Brazil', 'Americas', 'Cultural', '/images/christ-redeemer.jpg', 26.99, 35, 4.8, -22.9519, -43.2105, false),
('Niagara Falls', 'Waterfalls on US-Canada border', 'Canada', 'Americas', 'Nature', '/images/niagara-falls.jpg', 29.99, 40, 4.7, 43.0962, -79.0377, false),
('Yellowstone', 'National park in USA', 'USA', 'Americas', 'Nature', '/images/yellowstone.jpg', 41.99, 70, 4.8, 44.4280, -110.5885, false),
('Chichen Itza', 'Maya archaeological site in Mexico', 'Mexico', 'Americas', 'Cultural', '/images/chichen-itza.jpg', 33.99, 50, 4.7, 20.6843, -88.5678, false),
('Banff National Park', 'Mountain wilderness in Canada', 'Canada', 'Americas', 'Nature', '/images/banff.jpg', 36.99, 60, 4.8, 51.4968, -115.9281, false),
('Easter Island', 'Polynesian island with moai statues', 'Chile', 'Americas', 'Cultural', '/images/easter-island.jpg', 47.99, 75, 4.6, -27.1127, -109.3497, false),
('Amazon Rainforest', 'Tropical rainforest in South America', 'Brazil', 'Americas', 'Nature', '/images/amazon.jpg', 43.99, 80, 4.7, -3.4653, -62.2159, false),

-- Africa
('Pyramids of Giza', 'Ancient pyramids in Egypt', 'Egypt', 'Africa', 'Cultural', '/images/pyramids.jpg', 34.99, 50, 4.8, 29.9792, 31.1342, true),
('Victoria Falls', 'Waterfall on Zambezi River', 'Zambia', 'Africa', 'Nature', '/images/victoria-falls.jpg', 39.99, 45, 4.7, -17.9243, 25.8572, false),
('Kilimanjaro', 'Highest mountain in Africa', 'Tanzania', 'Africa', 'Nature', '/images/kilimanjaro.jpg', 42.99, 60, 4.8, -3.0674, 37.3556, false),
('Sahara Desert', 'Largest hot desert in the world', 'Morocco', 'Africa', 'Nature', '/images/sahara.jpg', 37.99, 55, 4.6, 25.0000, 0.0000, false),
('Table Mountain', 'Flat-topped mountain in South Africa', 'South Africa', 'Africa', 'Nature', '/images/table-mountain.jpg', 31.99, 40, 4.7, -33.9625, 18.4107, false),

-- Oceania
('Sydney Opera House', 'Performing arts centre in Australia', 'Australia', 'Oceania', 'Cultural', '/images/sydney-opera.jpg', 28.99, 35, 4.8, -33.8568, 151.2153, true),
('Great Barrier Reef', 'Coral reef system in Australia', 'Australia', 'Oceania', 'Nature', '/images/great-barrier-reef.jpg', 45.99, 70, 4.9, -18.2871, 147.6992, false),
('Milford Sound', 'Fjord in New Zealand', 'New Zealand', 'Oceania', 'Nature', '/images/milford-sound.jpg', 41.99, 55, 4.8, -44.6740, 167.9250, false),
('Uluru', 'Large sandstone rock formation in Australia', 'Australia', 'Oceania', 'Nature', '/images/uluru.jpg', 35.99, 45, 4.7, -25.3444, 131.0369, false),
('Bora Bora', 'Island in French Polynesia', 'French Polynesia', 'Oceania', 'Nature', '/images/bora-bora.jpg', 52.99, 80, 4.9, -16.5004, -151.7415, false)