import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Trophy, Star, Zap } from 'lucide-react';

interface VRHeadset {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

const About = () => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [headsets, setHeadsets] = useState<VRHeadset[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize game
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setHeadsets([]);
    generateHeadsets();
  };

  // Generate random VR headsets
  const generateHeadsets = () => {
    const newHeadsets: VRHeadset[] = [];
    for (let i = 0; i < 8; i++) {
      newHeadsets.push({
        id: i,
        x: Math.random() * 80 + 10, // 10-90% of container width
        y: Math.random() * 60 + 20, // 20-80% of container height
        collected: false,
      });
    }
    setHeadsets(newHeadsets);
  };

  // Collect headset
  const collectHeadset = (id: number) => {
    setHeadsets(prev => prev.map(headset => 
      headset.id === id ? { ...headset, collected: true } : headset
    ));
    setScore(prev => prev + 10);
  };

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft, score, highScore]);

  // Regenerate headsets periodically
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => {
        setHeadsets(prev => prev.map(headset => ({
          ...headset,
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          collected: false,
        })));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            About CloudVR Tours
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're building the future of virtual tourism. Stay tuned for an amazing experience!
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-blue-600 mb-2">🚀 Coming Soon</CardTitle>
              <CardDescription className="text-lg">
                We're working hard to bring you the most immersive VR tourism experience ever created.
                While you wait, enjoy our mini game below!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge variant="secondary" className="px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  VR Technology
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Headphones className="w-4 h-4 mr-2" />
                  360° Audio
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  Premium Tours
                </Badge>
              </div>
              <p className="text-gray-600">
                Expected launch: Q2 2024
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mini Game Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">🎮 VR Headset Collection Game</CardTitle>
              <CardDescription className="text-center">
                Collect as many VR headsets as you can before time runs out!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Game Stats */}
              <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{score}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{timeLeft}</div>
                  <div className="text-sm text-gray-600">Time Left</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{highScore}</div>
                  <div className="text-sm text-gray-600">High Score</div>
                </div>
              </div>

              {/* Game Area */}
              <div
                ref={gameAreaRef}
                className="relative w-full h-96 bg-gradient-to-b from-sky-200 to-blue-300 rounded-lg overflow-hidden border-2 border-blue-200"
                style={{ position: 'relative' }}
              >
                {!gameActive && !gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <Button onClick={startGame} size="lg" className="text-lg px-8 py-4">
                      <Trophy className="w-5 h-5 mr-2" />
                      Start Game
                    </Button>
                  </div>
                )}

                {gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Card className="text-center p-6">
                      <CardTitle className="text-2xl mb-2">Game Over!</CardTitle>
                      <p className="text-lg mb-4">Final Score: {score}</p>
                      {score === highScore && score > 0 && (
                        <p className="text-yellow-600 font-bold mb-4">🎉 New High Score!</p>
                      )}
                      <Button onClick={startGame} variant="outline">
                        Play Again
                      </Button>
                    </Card>
                  </div>
                )}

                {/* VR Headsets */}
                <AnimatePresence>
                  {headsets.map((headset) => (
                    !headset.collected && (
                      <motion.div
                        key={headset.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute cursor-pointer"
                        style={{
                          left: `${headset.x}%`,
                          top: `${headset.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => collectHeadset(headset.id)}
                      >
                        <div className="text-4xl hover:animate-bounce">
                          🥽
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>

                {/* Game Instructions */}
                {gameActive && (
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg text-sm">
                    Click the VR headsets to collect them!
                  </div>
                )}
              </div>

              {/* Game Instructions */}
              <div className="mt-6 text-center text-gray-600">
                <p className="mb-2">🎯 How to Play:</p>
                <p>Click on the floating VR headsets (🥽) to collect them and earn points!</p>
                <p>Headsets will respawn every 3 seconds. Collect as many as you can in 30 seconds!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 text-gray-500"
        >
          <p>© 2024 CloudVR Tours. All rights reserved.</p>
          <p className="mt-2">Building the future of virtual tourism, one experience at a time.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
