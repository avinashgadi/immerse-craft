import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCcw, Maximize, Info } from 'lucide-react';
import * as THREE from 'three';
import type { Tour, Hotspot } from '@/data/tours';

interface VRViewerProps {
  tour: Tour;
  onClose?: () => void;
}

interface HotspotMarkerProps {
  hotspot: Hotspot;
  onClick: (hotspot: Hotspot) => void;
}

interface VRSceneProps {
  tour: Tour;
  onHotspotClick: (hotspot: Hotspot) => void;
}

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ hotspot, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }
  });

  return (
    <group position={hotspot.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(hotspot)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color={hovered ? "#ff6b35" : "#3b82f6"} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]} scale={hovered ? 2 : 1.5}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.2}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0, 0.2, 0]}
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="glass px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
          {hotspot.title}
        </div>
      </Html>
    </group>
  );
};

const VRScene: React.FC<VRSceneProps> = ({ tour, onHotspotClick }) => {
  return (
    <>
      {/* 360 Environment Sphere */}
      <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
        <meshBasicMaterial 
          map={new THREE.TextureLoader().load(tour.image)}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Hotspots */}
      {tour.hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          onClick={onHotspotClick}
        />
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
    </>
  );
};

const VRViewer: React.FC<VRViewerProps> = ({ tour, onClose }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
  };

  const closeHotspotPanel = () => {
    setSelectedHotspot(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* VR Canvas */}
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={<Html center>Loading VR Experience...</Html>}>
          <VRScene tour={tour} onHotspotClick={handleHotspotClick} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={0.1}
            maxDistance={10}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 flex flex-col space-y-2"
      >
        <Button
          variant="glass"
          size="icon"
          onClick={() => setIsAudioEnabled(!isAudioEnabled)}
          title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="glass"
          size="icon"
          onClick={() => window.location.reload()}
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="glass"
          size="icon"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Tour Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 left-4 glass p-4 rounded-lg max-w-sm"
      >
        <h3 className="font-semibold text-lg mb-2">{tour.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{tour.description}</p>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span>Duration: {tour.duration}</span>
          <span>Rating: {tour.rating}★</span>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 glass p-3 rounded-lg"
      >
        <div className="text-xs text-muted-foreground space-y-1">
          <p>🖱️ Click & drag to look around</p>
          <p>🎯 Click blue markers for more info</p>
          <p>🔍 Scroll to zoom in/out</p>
        </div>
      </motion.div>

      {/* Close Button */}
      {onClose && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2"
        >
          <Button
            variant="destructive"
            onClick={onClose}
            className="px-6"
          >
            Exit VR Tour
          </Button>
        </motion.div>
      )}

      {/* Hotspot Details Panel */}
      {selectedHotspot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute inset-4 flex items-center justify-center pointer-events-none"
        >
          <div className="glass p-6 rounded-xl max-w-md pointer-events-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-lg">{selectedHotspot.title}</h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeHotspotPanel}
              >
                ✕
              </Button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              {selectedHotspot.description}
            </p>
            
            {selectedHotspot.content && (
              <p className="text-sm mb-4">{selectedHotspot.content}</p>
            )}

            {selectedHotspot.type === 'audio' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Audio Guide</p>
                <Button variant="secondary" size="sm">
                  🎵 Play Audio
                </Button>
              </div>
            )}

            {selectedHotspot.type === 'video' && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Video Content</p>
                <Button variant="secondary" size="sm">
                  ▶️ Play Video
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Loading Fallback */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading VR Experience...</p>
          </div>
        </div>
      } />
    </div>
  );
};

export default VRViewer;