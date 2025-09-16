import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, Star, Globe, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { buildCloudinarySrcSet, buildCloudinaryUrl, cloudinaryAvailable } from '@/lib/cloudinary';

// Import destination images
import mountFujiImage from '@/assets/dest-mount-fuji.png';
import tajMahalImage from '@/assets/dest-taj-mahal.jpg';
import angkorWatImage from '@/assets/dest-angkor-wat.png';
import greatWallImage from '@/assets/dest-great-wall.png';
import tokyoShibuyaImage from '@/assets/dest-tokyo-shibuya.png';
import petraImage from '@/assets/dest-petra.jpg';
import borobudurImage from '@/assets/dest-borobudur.jpg';
import baganTemplesImage from '@/assets/dest-bagan-temples.jpg';
import haLongBayImage from '@/assets/dest-ha-long-bay.jpg';
import jejuIslandImage from '@/assets/dest-jeju-island.jpg';

interface Destination {
  id: string;
  name: string;
  description: string;
  country: string;
  region: string;
  category: string;
  image_url: string;
  price: number;
  duration_minutes: number;
  rating: number;
  latitude: number;
  longitude: number;
  featured: boolean;
}

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Map destination names to their corresponding images / Cloudinary public IDs
  const localImageMap: { [key: string]: string } = {
    'Mount Fuji': mountFujiImage,
    'Taj Mahal': tajMahalImage,
    'Angkor Wat': angkorWatImage,
    'Great Wall of China': greatWallImage,
    'Tokyo Shibuya': tokyoShibuyaImage,
    'Petra': petraImage,
    'Borobudur': borobudurImage,
    'Bagan Temples': baganTemplesImage,
    'Ha Long Bay': haLongBayImage,
    'Jeju Island': jejuIslandImage,
  };

  // Optional Cloudinary public IDs. Replace with your actual public IDs if different.
  const cloudinaryPublicIdMap: { [key: string]: string } = {
    'Mount Fuji': 'immersive/dest-mount-fuji',
    'Taj Mahal': 'immersive/dest-taj-mahal',
    'Angkor Wat': 'immersive/dest-angkor-wat',
    'Great Wall of China': 'immersive/dest-great-wall',
    'Tokyo Shibuya': 'immersive/dest-tokyo-shibuya',
    'Petra': 'immersive/dest-petra',
    'Borobudur': 'immersive/dest-borobudur',
    'Bagan Temples': 'immersive/dest-bagan-temples',
    'Ha Long Bay': 'immersive/dest-ha-long-bay',
    'Jeju Island': 'immersive/dest-jeju-island',
  };

  const getResponsiveImage = (name: string) => {
    const fallback = localImageMap[name] || '/placeholder.svg';
    if (!cloudinaryAvailable()) {
      return { src: fallback, srcSet: undefined as string | undefined, sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw' };
    }
    const publicId = cloudinaryPublicIdMap[name];
    if (!publicId) {
      return { src: fallback, srcSet: undefined as string | undefined, sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw' };
    }
    const src = buildCloudinaryUrl(publicId, { width: 800, height: 400, fit: 'fill', quality: 'auto', format: 'auto', dpr: 'auto', gravity: 'auto' }) || fallback;
    const srcSetArr = buildCloudinarySrcSet(publicId, [320, 480, 640, 768, 1024, 1280, 1600]);
    const srcSet = srcSetArr ? srcSetArr.join(', ') : undefined;
    return { src, srcSet, sizes: '(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' };
  };

  const regions = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];
  const categories = ['All', 'Cultural', 'Nature', 'Urban', 'Adventure'];

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [destinations, searchQuery, selectedRegion, selectedCategory]);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast({
        title: "Error",
        description: "Failed to load destinations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDestinations = () => {
    let filtered = destinations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by region
    if (selectedRegion !== 'All') {
      filtered = filtered.filter(dest => dest.region === selectedRegion);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  };

  const handleStartTour = (destination: Destination) => {
    navigate('/vr-tour', { state: { destination } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{destinations.length}+ Destinations Available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Explore World Destinations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover breathtaking places from around the globe with our immersive VR tours. 
              Travel anywhere, anytime, from the comfort of your browser.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search destinations, countries, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredDestinations.length} of {destinations.length} destinations
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover-scale">
                  <div className="relative h-48 overflow-hidden">
                    {(() => {
                      const responsive = getResponsiveImage(destination.name);
                      return (
                        <img
                          src={responsive.src}
                          srcSet={responsive.srcSet}
                          sizes={responsive.sizes}
                          alt={destination.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = localImageMap[destination.name] || '/placeholder.svg';
                            target.removeAttribute('srcset');
                            target.removeAttribute('sizes');
                          }}
                        />
                      );
                    })()}
                    {destination.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary">
                        Featured
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 glass px-2 py-1 rounded-md">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{destination.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {destination.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{destination.country}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {destination.description}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{Math.round(destination.duration_minutes)} mins</span>
                      </div>
                      <div className="font-semibold text-primary">
                        ${destination.price}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartTour(destination)}
                      className="w-full"
                      size="sm"
                    >
                      Start VR Tour
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredDestinations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destinations;