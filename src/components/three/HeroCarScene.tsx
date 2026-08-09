"use client";

import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/layout/ThemeProvider";

/* ── shared theme state for R3F children ───────────────────── */
let activeTheme: "dark" | "light" = "dark";

/* ── car model ────────────────────────────────────────────── */

function CarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/audi_a6_c8_limousine.glb");
  const prevTheme = useRef(activeTheme);

  const isTire = (child: THREE.Object3D) => {
    const name = (child.name || "").toLowerCase();
    return name.includes("wheel") && name.includes("tire")
      || name.includes("wheel") && (name.includes("child") || name.includes("wheel"))
      && (child as THREE.Mesh).geometry
      && (child as THREE.Mesh).geometry.attributes.position
      && (child as THREE.Mesh).geometry.attributes.position.count > 500;
  };

  const applyTheme = (isLight: boolean) => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const mat = child.material as THREE.MeshPhysicalMaterial;
          const name = (child.name || "").toLowerCase();
          const matName = ((child.material as THREE.MeshPhysicalMaterial).name || "").toLowerCase();
          const isWheel = name.includes("wheel") && (name.includes("child") || name.includes("wheel"))
            || matName.includes("wheel");
          const isBodyPaint = name.includes("paint") || name.includes("bodyshell_paint");

          if (isWheel) {
            mat.color.set("#1a1a1a");
            mat.metalness = 0.1;
            mat.roughness = 0.85;
            mat.clearcoat = 0;
            mat.envMapIntensity = 0.3;
          } else if (mat.metalness !== undefined && !isBodyPaint) {
            if (isLight) {
              mat.color.set("#d4d4d8");
              mat.metalness = 0.7;
              mat.roughness = 0.25;
              mat.clearcoat = 0.6;
              mat.envMapIntensity = 2.0;
            } else {
              mat.metalness = Math.min(mat.metalness, 0.9);
              mat.roughness = Math.max(mat.roughness, 0.1);
              mat.clearcoat = 0.4;
              mat.envMapIntensity = 1.5;
            }
          }
        }
      }
    });
  };

  applyTheme(activeTheme === "light");

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = performance.now() / 1000 * 0.15;
    }
    if (prevTheme.current !== activeTheme) {
      prevTheme.current = activeTheme;
      applyTheme(activeTheme === "light");
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
  const ref1 = useRef<THREE.SpotLight>(null);
  const ref2 = useRef<THREE.SpotLight>(null);
  const refAmbient = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    const isLight = activeTheme === "light";
    if (ref1.current) {
      ref1.current.color.set(isLight ? "#14649B" : "#20E0FF");
      ref1.current.intensity = isLight ? 2 : 3;
    }
    if (ref2.current) {
      ref2.current.color.set(isLight ? "#94A3B8" : "#14649B");
      ref2.current.intensity = isLight ? 1 : 1.5;
    }
    if (refAmbient.current) {
      refAmbient.current.intensity = isLight ? 0.5 : 0.25;
    }
  });

  return (
    <>
      <spotLight
        ref={ref1}
        position={[6, 10, 6]}
        angle={0.3}
        penumbra={1}
        intensity={3}
        color="#20E0FF"
      />
      <spotLight
        ref={ref2}
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
      <ambientLight ref={refAmbient} intensity={0.25} />
    </>
  );
}

/* ── sweeping light across car ─────────────────────────────── */

function SweepingLight() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (ref.current) {
      const t = performance.now() / 1000;
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
  const mat1Ref = useRef<THREE.MeshBasicMaterial>(null);
  const mat2Ref = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const t = performance.now() / 1000;
    const isLight = activeTheme === "light";
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * (Math.PI * 2) / 30;
      ring1Ref.current.rotation.x = Math.PI / 2.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -(t * (Math.PI * 2) / 40);
      ring2Ref.current.rotation.x = Math.PI / 2.2;
    }
    if (mat1Ref.current) {
      mat1Ref.current.opacity = isLight ? 0.15 : 0.08;
      mat1Ref.current.color.set(isLight ? "#14649B" : "#20E0FF");
    }
    if (mat2Ref.current) {
      mat2Ref.current.opacity = isLight ? 0.1 : 0.05;
      mat2Ref.current.color.set(isLight ? "#14649B" : "#00F0FF");
    }
  });

  return (
    <>
      {/* Primary halo ring */}
      <mesh ref={ring1Ref} position={[0, 0.3, 0]}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial
          ref={mat1Ref}
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
          ref={mat2Ref}
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
  const matRef = useRef<THREE.PointsMaterial>(null);
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

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = performance.now() / 1000 * 0.008;
    }
    if (matRef.current) {
      const isLight = activeTheme === "light";
      matRef.current.color.set(isLight ? "#14649B" : "#20E0FF");
      matRef.current.opacity = isLight ? 0.12 : 0.06;
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
        ref={matRef}
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
  const { theme } = useTheme();

  useEffect(() => {
    activeTheme = theme;
  }, [theme]);

  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [3, 2, 8], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <NeonLights />
          <SweepingLight />
          <RingHalos />
          <FloatingParticles />
          <CarModel />

          <Environment preset={theme === "light" ? "city" : "night"} />

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


