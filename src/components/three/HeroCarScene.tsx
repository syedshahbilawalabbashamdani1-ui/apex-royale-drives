"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ── car model ────────────────────────────────────────────── */

function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/audi_a6_c8_limousine.glb");

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.material) {
        const mat = child.material as THREE.MeshPhysicalMaterial;
        if (mat.metalness !== undefined) {
          mat.metalness = Math.min(mat.metalness, 0.9);
          mat.roughness = Math.max(mat.roughness, 0.1);
          mat.clearcoat = 0.4;
          mat.clearcoatRoughness = 0.2;
          mat.envMapIntensity = 1.5;
        }
      }
    }
  });

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={1.08} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/* ── showroom lights ──────────────────────────────────────── */

function NeonLights() {
  return (
    <>
      <spotLight
        position={[6, 10, 6]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#20E0FF"
      />
      <spotLight
        position={[-6, 8, -6]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        color="#14649B"
      />
      <spotLight
        position={[0, 8, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={1}
        color="#ffffff"
      />
      <pointLight position={[4, 2, 4]} intensity={0.6} color="#20E0FF" />
      <pointLight position={[-4, 2, -4]} intensity={0.4} color="#00F0FF" />
      <pointLight position={[0, -0.5, 0]} intensity={0.3} color="#20E0FF" />
      <ambientLight intensity={0.25} />
    </>
  );
}

/* ── sweeping light across car ─────────────────────────────── */

function SweepingLight() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      // Sweep back and forth every 6 seconds
      ref.current.position.x = Math.sin(t * (Math.PI / 3)) * 3;
      ref.current.position.z = Math.cos(t * (Math.PI / 3)) * 2;
      // Subtle intensity pulse
      ref.current.intensity = 0.3 + Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <pointLight
      ref={ref}
      position={[0, 3, 2]}
      intensity={0.3}
      color="#ffffff"
      distance={12}
      decay={2}
    />
  );
}

/* ── translucent ring halos ────────────────────────────────── */

function RingHalos() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      // 30 seconds per revolution
      ring1Ref.current.rotation.z = t * (Math.PI * 2) / 30;
      ring1Ref.current.rotation.x = Math.PI / 2.5;
    }
    if (ring2Ref.current) {
      // 40 seconds per revolution, opposite direction
      ring2Ref.current.rotation.z = -(t * (Math.PI * 2) / 40);
      ring2Ref.current.rotation.x = Math.PI / 2.2;
    }
  });

  return (
    <>
      {/* Primary halo ring */}
      <mesh ref={ring1Ref} position={[0, 0.3, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial
          color="#20E0FF"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Secondary halo ring - slightly larger, offset angle */}
      <mesh ref={ring2Ref} position={[0, 0.1, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

/* ── sparse floating particles ─────────────────────────────── */

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 40;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#20E0FF"
        transparent
        opacity={0.06}
        sizeAttenuation
      />
    </points>
  );
}

/* ── loading fallback ──────────────────────────────────────── */

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full animate-spin mx-auto mb-3" />
        <p className="font-inter text-xs text-silver-chrome">
          Loading 3D Experience...
        </p>
      </div>
    </div>
  );
}

/* ── main scene ────────────────────────────────────────────── */

interface HeroCarSceneProps {
  className?: string;
}

export default function HeroCarScene({ className = "" }: HeroCarSceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [5, 2, 5], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <NeonLights />
          <SweepingLight />
          <RingHalos />
          <FloatingParticles />
          <CarModel />

          <Environment preset="night" />

          <OrbitControls
            autoRotate
            autoRotateSpeed={0.4}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2.3}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload("/models/audi_a6_c8_limousine.glb");
