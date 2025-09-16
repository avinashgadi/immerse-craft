import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Globe, Headphones, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-vr-tourism.jpg';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="VR Tourism Experience" 
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 hero-gradient opacity-30" />
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 glass p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        onClick={() => navigate('/destinations')}
      >
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-secondary" />
          <span className="text-sm font-medium">5.0 Rating</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 right-16 glass p-4 rounded-xl animate-float"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">150+ Destinations</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Curated Immersive Tours
            </span>
          </motion.div>

          {/* Headlines */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block"
              >
                Travel the World
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
              >
                From Your Browser
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Experience breathtaking destinations through AI-curated immersive VR tours. 
              No headset required — just your curiosity and wanderlust.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="hero" size="xl" className="group" onClick={() => navigate('/destinations')}>
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Your Journey
            </Button>
            <Button variant="vr" size="xl" className="group" onClick={() => navigate('/demo')}>
              <Headphones className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">150+</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-secondary">10M+</div>
              <div className="text-sm text-muted-foreground">Tours Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-primary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;