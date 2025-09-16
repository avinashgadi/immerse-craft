import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Headset, Smartphone, Globe, Zap, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: Headset,
    title: 'No VR Headset Required',
    description: 'Experience immersive tours directly in your browser with our advanced WebXR technology and 360° fallback support.',
    color: 'from-primary to-primary-glow'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Seamless experience across all devices with gyroscope support and touch-friendly navigation.',
    color: 'from-secondary to-accent'
  },
  {
    icon: Globe,
    title: '150+ Destinations',
    description: 'Explore carefully curated tours from ancient temples to modern cityscapes across six continents.',
    color: 'from-accent to-secondary'
  },
  {
    icon: Zap,
    title: 'AI-Curated Content',
    description: 'Smart recommendations and personalized tour suggestions based on your preferences and interests.',
    color: 'from-primary to-accent'
  },
  {
    icon: Users,
    title: 'Social Experience',
    description: 'Share tours with friends, leave reviews, and join a community of virtual travelers.',
    color: 'from-secondary to-primary'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and privacy-first design principles.',
    color: 'from-accent to-primary'
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
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
              Why Choose CloudVR?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of travel with our cutting-edge VR technology and AI-powered content curation
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group"
              >
                <Card className="h-full border-0 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 transform hover:scale-105">
                  <CardContent className="p-8 text-center space-y-6">
                    {/* Icon */}
                    <motion.div
                      className="relative mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, var(--primary), var(--accent))`
                      }}
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-10 w-10 text-primary-foreground" />
                      
                      {/* Glow effect */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
                        style={{
                          background: `linear-gradient(135deg, var(--primary), var(--accent))`
                        }}
                      />
                    </motion.div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Ready to Start Your Virtual Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of travelers exploring the world from the comfort of their homes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="px-8 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-muted transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;