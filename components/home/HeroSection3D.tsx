import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Mesh } from 'three';

// 1. The 3D Sacred Geometry Component
const SacredGeometry = () => {
  const meshRef = useRef<Mesh>(null);
  
  // This hook rotates the shape slightly every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[2, 0]} position={[0, 0, 0]}>
      {/* Wireframe gives it that modern, architectural/mystical look */}
      <meshStandardMaterial color="#8b5cf6" wireframe={true} />
    </Icosahedron>
  );
};

// 2. The Main Hero Section Component
export default function HeroSection() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#0f172a', overflow: 'hidden' }}>
      
      {/* --- 3D BACKGROUND LAYER --- */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {/* Subtle moving starfield for cosmic energy */}
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <SacredGeometry />
        </Canvas>
      </div>

      {/* --- GLASSMORPHIC UI & TEXT LAYER --- */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
        
        {/* Framer Motion handles the smooth slide-up and fade-in */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ 
            textAlign: 'center', 
            padding: '3rem 4rem', 
            background: 'rgba(255, 255, 255, 0.03)', // Frosted glass background
            backdropFilter: 'blur(12px)', // The actual glass blur effect
            WebkitBackdropFilter: 'blur(12px)', // Safari support
            borderRadius: '24px', 
            border: '1px solid rgba(255, 255, 255, 0.1)', // Subtle light border
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0', fontWeight: '300', letterSpacing: '0.05em' }}>
            NumeroSoul
          </h1>
          <p style={{ fontSize: '1.25rem', margin: 0, opacity: 0.7, fontWeight: '300' }}>
            Light-filled numerology for grounded inner clarity.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
