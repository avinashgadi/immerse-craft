import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VRViewer from '@/components/vr/VRViewer';
import { tours, Tour } from '@/data/tours';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const VRTour = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useEffect(() => {
    if (location.state?.destination) {
      const destination = location.state.destination;
      
      // Convert destination to tour format
      const tour: Tour = {
        id: destination.id,
        title: destination.name,
        description: destination.description,
        image: destination.image_url || '/placeholder.svg',
        duration: `${Math.round(destination.duration_minutes)} mins`,
        price: destination.price,
        rating: destination.rating,
        category: destination.category,
        region: destination.region,
        highlights: [
          'Immersive 360° experience',
          'Interactive hotspots',
          'HD quality visuals',
          'Audio narration'
        ],
        hotspots: [
          {
            id: 'h1',
            title: 'Main Viewpoint',
            description: `The primary viewing area of ${destination.name}`,
            position: [0, 2, -5],
            type: 'info',
            content: `Welcome to ${destination.name}. ${destination.description}`
          },
          {
            id: 'h2',
            title: 'Historical Context',
            description: 'Learn about the history and significance',
            position: [3, 1, 2],
            type: 'audio',
            audioUrl: '/audio/narration.mp3'
          },
          {
            id: 'h3',
            title: 'Cultural Insights',
            description: 'Discover local culture and traditions',
            position: [-2, 1, 3],
            type: 'video',
            videoUrl: '/video/culture.mp4'
          }
        ],
        featured: destination.featured
      };
      
      setSelectedTour(tour);
    } else {
      // Fallback to default tour
      setSelectedTour(tours[0]);
    }
  }, [location.state]);

  const handleCloseTour = () => {
    navigate('/destinations');
  };

  if (!selectedTour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading VR experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 z-50"
      >
        <Button
          variant="glass"
          size="sm"
          onClick={handleCloseTour}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Destinations</span>
        </Button>
      </motion.div>

      {/* VR Viewer */}
      <VRViewer tour={selectedTour} onClose={handleCloseTour} />
    </div>
  );
};

export default VRTour;