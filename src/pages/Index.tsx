import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import FeaturedTours from '@/components/sections/FeaturedTours';
import Features from '@/components/sections/Features';
import Footer from '@/components/layout/Footer';
import { tours } from '@/data/tours';

// Lazy load VR viewer to improve initial page load
const VRViewer = lazy(() => import('@/components/vr/VRViewer'));

const Index = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [showVRViewer, setShowVRViewer] = useState(false);

  const handleStartTour = (tour: any) => {
    setSelectedTour(tour);
    setShowVRViewer(true);
  };

  const handleCloseTour = () => {
    setShowVRViewer(false);
    setSelectedTour(null);
  };

  if (showVRViewer && selectedTour) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading VR Experience...</p>
          </div>
        </div>
      }>
        <VRViewer tour={selectedTour} onClose={handleCloseTour} />
      </Suspense>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <main>
        <Hero />
        <FeaturedTours />
        <Features />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
