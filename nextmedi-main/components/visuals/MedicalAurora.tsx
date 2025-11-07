"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PointMaterial, Points } from "@react-three/drei";
import { cn } from "@/lib/utils";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type MedicalAuroraProps = {
  className?: string;
};

function FloatingPulse() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const progress = i / count;
      const angle = progress * Math.PI * 8;
      const spiralRadius = 1.15 + progress * 1.1;
      const verticalIndex = (i % 120) / 120 - 0.5;
      const height = verticalIndex * 2.2;
      const wave = Math.sin(angle * 1.6 + verticalIndex * 6) * 0.35;

      positions[i * 3] = Math.cos(angle) * spiralRadius * 0.9;
      positions[i * 3 + 1] = height + Math.cos(progress * Math.PI * 2) * 0.08;
      positions[i * 3 + 2] = Math.sin(angle) * spiralRadius * 0.9 + wave;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const elapsed = clock.getElapsedTime();
    ref.current.rotation.y = elapsed * 0.1;
    ref.current.rotation.x = Math.sin(elapsed * 0.3) * 0.2;
    const material = ref.current.material as THREE.PointsMaterial;
    if (material) {
      material.opacity = 0.3 + Math.sin(elapsed * 0.9) * 0.12;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        size={0.04}
        transparent
        color="#67e8f9"
        depthWrite={false}
        sizeAttenuation
      />
    </Points>
  );
}

export function MedicalAurora({ className }: MedicalAuroraProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <Canvas camera={{ position: [0, 0, 3.2], fov: 55 }}>
        <color attach="background" args={["#020617"]} />
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
          <FloatingPulse />
        </Float>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35)_0%,rgba(8,47,73,0)_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.3)_0%,rgba(15,23,42,0)_65%)]" />
    </div>
  );
}

export default MedicalAurora;
