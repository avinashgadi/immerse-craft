import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Mouse, Smartphone, Headphones, Star, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import VRViewer from '@/components/vr/VRViewer';
import { tours } from '@/data/tours';

const Demo = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Welcome to VR Tours",
      description: "Experience immersive travel from your browser",
      icon: <Play className="h-6 w-6" />,
      instruction: "Click 'Start Demo' to begin your virtual journey"
    },
    {
      title: "Navigate the Environment",
      description: "Use your mouse or touch to look around",
      icon: <Mouse className="h-6 w-6" />,
      instruction: "Click and drag to explore the 360° environment"
    },
    {
      title: "Interactive Hotspots",
      description: "Click on blue markers for more information",
      icon: <Star className="h-6 w-6" />,
      instruction: "Look for glowing blue spheres and click them"
    },
    {
      title: "Audio Experience",
      description: "Enjoy immersive audio narration",
      icon: <Headphones className="h-6 w-6" />,
      instruction: "Make sure your audio is enabled for the full experience"
    },
    {
      title: "Mobile Compatible",
      description: "Works great on mobile devices with gyroscope",
      icon: <Smartphone className="h-6 w-6" />,
      instruction: "On mobile, move your device to look around naturally"
    }
  ];

  const handleStartDemo = () => {
    setShowDemo(true);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
    setCurrentStep(0);
  };

  if (showDemo) {
    return <VRViewer tour={tours[0]} onClose={handleCloseDemo} />;
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
            <Badge className="mx-auto">
              Interactive Demo
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold gradient-text">
              Experience VR Tours
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to navigate and interact with our immersive VR tours. 
              No headset required - just your browser!
            </p>
            <Button
              onClick={handleStartDemo}
              size="lg"
              className="group"
            >
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Interactive Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Demo Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Follow these simple steps to get the most out of your VR tour experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {demoSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {step.icon}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium text-center">
                        {step.instruction}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass p-8 rounded-xl text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
            <p className="text-muted-foreground mb-6">
              Now that you know how it works, try our demo tour or explore our full collection of destinations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleStartDemo}
                size="lg"
                className="group"
              >
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Try Demo Tour
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/destinations'}
                className="group"
              >
                Browse All Destinations
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Requirements */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">System Requirements</h2>
            <p className="text-muted-foreground">
              CloudVR Tours works on most modern browsers and devices
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desktop</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Chrome, Firefox, Safari, Edge</li>
                  <li>• WebGL support</li>
                  <li>• Minimum 4GB RAM</li>
                  <li>• Mouse or trackpad</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mobile</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• iOS 12+ or Android 8+</li>
                  <li>• Modern browser</li>
                  <li>• Gyroscope (optional)</li>
                  <li>• Touch screen</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">VR Headset</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Oculus Quest/Rift</li>
                  <li>• HTC Vive</li>
                  <li>• WebXR compatible</li>
                  <li>• Enhanced experience</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Demo;