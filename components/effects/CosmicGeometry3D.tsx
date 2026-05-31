"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Dodecahedron, Text } from '@react-three/drei';
import { Mesh, Group } from 'three';

// Component for orbiting numbers
const OrbitingNumber = ({ 
  num, 
  radius, 
  speed, 
  phase, 
  color 
}: { 
  num: number; 
  radius: number; 
  speed: number; 
  phase: number; 
  color: string; 
}) => {
  const ref = useRef<Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime() * speed + phase;
      ref.current.position.x = Math.cos(time) * radius;
      ref.current.position.z = Math.sin(time) * radius;
      ref.current.position.y = Math.sin(time * 1.5) * (radius * 0.15); // subtle wave
      // Keep text facing the camera
      ref.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group ref={ref}>
      <Text
        fontSize={0.28}
        color={color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={0.7}
      >
        {num}
      </Text>
    </group>
  );
};

// Main 3D geometry scene
const GeometryScene = ({ color = "#E8A020" }: { color?: string }) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.06; // slowly rotate the whole system of numbers
    }
  });

  // Generate 9 orbiting numbers corresponding to the 9 single digits in numerology
  const numbers = useMemo(() => {
    const colors = ["#F97316", "#94A3B8", "#EAB308", "#7C3AED", "#22C55E", "#EC4899", "#D4700A", "#1E40AF", "#EF4444"];
    return Array.from({ length: 9 }, (_, i) => ({
      num: i + 1,
      radius: 1.5 + (i * 0.16),
      speed: 0.15 + (i * 0.04), // slightly different speeds
      phase: (i * Math.PI * 2) / 9,
      color: colors[i] || color
    }));
  }, [color]);

  return (
    <group ref={groupRef}>
      {/* Central Dodecahedron representing 12 houses / cycles */}
      <Dodecahedron ref={meshRef} args={[0.9, 0]}>
        <meshBasicMaterial 
          color={color} 
          wireframe={true} 
          transparent={true} 
          opacity={0.3} 
        />
      </Dodecahedron>

      {/* Orbiting numbers */}
      {numbers.map((n) => (
        <OrbitingNumber 
          key={n.num} 
          num={n.num} 
          radius={n.radius} 
          speed={n.speed} 
          phase={n.phase} 
          color={n.color} 
        />
      ))}
    </group>
  );
};

export function CosmicGeometry3D({ 
  className = "", 
  color = "#E8A020" 
}: { 
  className?: string; 
  color?: string; 
}) {
  return (
    <div className={`w-full h-full relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <GeometryScene color={color} />
      </Canvas>
    </div>
  );
}
