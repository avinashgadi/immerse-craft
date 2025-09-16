import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Star, MapPin, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tours } from '@/data/tours';

const FeaturedTours = () => {
  const navigate = useNavigate();
  const featuredTours = tours.filter(tour => tour.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="tours" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Featured Destinations
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked immersive experiences that transport you to the world's most incredible places
          </p>
        </motion.div>

        {/* Featured Tours Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {featuredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              variants={cardVariants}
              className="group"
            >
              <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 transform hover:scale-[1.02]">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-sm font-medium rounded-full backdrop-blur-sm">
                      {tour.category}
                    </span>
                  </div>

                  {/* Play Button */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg hover:bg-primary transition-colors cursor-pointer">
                      <Play className="h-6 w-6 text-primary-foreground ml-1" />
                    </div>
                  </motion.div>

                  {/* Price */}
                  <div className="absolute bottom-4 right-4">
                    <div className="glass px-3 py-1 rounded-full">
                      <span className="text-foreground font-semibold">${tour.price}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {tour.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {tour.description}
                      </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{tour.region}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="font-medium">{tour.rating}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Tour Highlights:</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {tour.highlights.slice(0, 4).map((highlight, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            <span className="truncate">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      variant="vr" 
                      className="w-full"
                      onClick={() => navigate('/vr-tour', { state: { tour } })}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start VR Tour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Tours */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="group"
            onClick={() => navigate('/destinations')}
          >
            Explore All Destinations
            <motion.span
              className="ml-2 inline-block"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTours;