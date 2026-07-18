"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Float,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

/* ── helpers ──────────────────────────────────────────────── */

function makeRoundedBox(
  w: number,
  h: number,
  d: number,
  r: number,
  segments = 4
) {
  const shape = new THREE.Shape();
  const hw = w / 2 - r;
  const hd = d / 2 - r;
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.quadraticCurveTo(hw + r, -hd, hw + r, -hd + r);
  shape.lineTo(hw + r, hd);
  shape.quadraticCurveTo(hw + r, hd + r, hw, hd + r);
  shape.lineTo(-hw, hd + r);
  shape.quadraticCurveTo(-hw - r, hd + r, -hw - r, hd);
  shape.lineTo(-hw - r, -hd);
  shape.quadraticCurveTo(-hw - r, -hd - r, -hw, -hd - r);
  shape.closePath();

  const extrudeSettings = {
    depth: h,
    bevelEnabled: true,
    bevelThickness: r * 0.5,
    bevelSize: r * 0.5,
    bevelSegments: segments,
  };
  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.rotateX(-Math.PI / 2);
  geom.translate(0, h / 2, 0);
  return geom;
}

/* ── car body ─────────────────────────────────────────────── */

function CarBody({ color = "#0A1A2E" }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  const bodyGeom = useMemo(() => makeRoundedBox(2, 0.55, 4.6, 0.15), []);

  /* roof / cabin profile – a curved extrusion along the car length */
  const cabinShape = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0, 0));
    pts.push(new THREE.Vector2(0.85, 0));
    pts.push(new THREE.Vector2(0.85, 0.05));
    pts.push(new THREE.Vector2(0.82, 0.35));
    pts.push(new THREE.Vector2(0.5, 0.48));
    pts.push(new THREE.Vector2(-0.15, 0.52));
    pts.push(new THREE.Vector2(-0.7, 0.45));
    pts.push(new THREE.Vector2(-0.85, 0.3));
    pts.push(new THREE.Vector2(-0.85, 0));
    pts.push(new THREE.Vector2(0, 0));
    return new THREE.Shape(pts);
  }, []);

  const cabinGeom = useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(cabinShape, {
      depth: 1.6,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 3,
    });
    geom.rotateY(Math.PI / 2);
    geom.translate(0, 0.55, 0);
    return geom;
  }, []);

  /* fender flares */
  const fenderGeom = useMemo(() => makeRoundedBox(2.15, 0.25, 1.1, 0.12), []);

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      {/* lower body */}
      <mesh geometry={bodyGeom} position={[0, 0, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          metalness={0.85}
          roughness={0.12}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* cabin / roof */}
      <mesh geometry={cabinGeom} position={[0, 0, -0.15]} castShadow>
        <meshPhysicalMaterial
          color={color}
          metalness={0.8}
          roughness={0.15}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* front fender */}
      <mesh geometry={fenderGeom} position={[0, 0.32, 1.6]} castShadow>
        <meshPhysicalMaterial
          color={color}
          metalness={0.85}
          roughness={0.1}
          clearcoat={0.7}
        />
      </mesh>

      {/* rear fender */}
      <mesh geometry={fenderGeom} position={[0, 0.32, -1.6]} castShadow>
        <meshPhysicalMaterial
          color={color}
          metalness={0.85}
          roughness={0.1}
          clearcoat={0.7}
        />
      </mesh>

      {/* hood scoop */}
      <mesh position={[0, 0.58, 1.2]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.8]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.08}
          clearcoat={0.8}
        />
      </mesh>

      {/* trunk lid */}
      <mesh position={[0, 0.56, -1.5]} castShadow>
        <boxGeometry args={[1.5, 0.04, 0.9]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.85}
          roughness={0.12}
          clearcoat={0.6}
        />
      </mesh>

      {/* ── windows ──────────────────────────── */}
      {/* windshield */}
      <mesh position={[0, 0.82, 0.82]} rotation={[0.45, 0, 0]}>
        <planeGeometry args={[1.5, 0.55]} />
        <meshPhysicalMaterial
          color="#88ccff"
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* rear window */}
      <mesh position={[0, 0.78, -0.95]} rotation={[-0.35, 0, 0]}>
        <planeGeometry args={[1.4, 0.45]} />
        <meshPhysicalMaterial
          color="#88ccff"
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* side windows – left */}
      <mesh position={[0.82, 0.78, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.6, 0.35]} />
        <meshPhysicalMaterial
          color="#88ccff"
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* side windows – right */}
      <mesh position={[-0.82, 0.78, 0.1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.6, 0.35]} />
        <meshPhysicalMaterial
          color="#88ccff"
          metalness={0.3}
          roughness={0.05}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── front bumper & grille ─────────────── */}
      <mesh position={[0, 0.2, 2.32]} castShadow>
        <boxGeometry args={[1.9, 0.35, 0.15]} />
        <meshPhysicalMaterial
          color="#111111"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* grille – vertical slats */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 2.38]}>
          <boxGeometry args={[0.04, 0.22, 0.04]} />
          <meshStandardMaterial
            color="#20E0FF"
            emissive="#20E0FF"
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* front splitter */}
      <mesh position={[0, 0.05, 2.35]}>
        <boxGeometry args={[2.0, 0.03, 0.1]} />
        <meshStandardMaterial
          color="#20E0FF"
          emissive="#20E0FF"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* ── rear bumper ───────────────────────── */}
      <mesh position={[0, 0.2, -2.32]} castShadow>
        <boxGeometry args={[1.9, 0.35, 0.15]} />
        <meshPhysicalMaterial
          color="#111111"
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* rear diffuser */}
      <mesh position={[0, 0.07, -2.35]}>
        <boxGeometry args={[1.6, 0.06, 0.08]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* exhaust pipes */}
      {[-0.4, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0.1, -2.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.12, 12]} />
          <meshStandardMaterial
            color="#888888"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* ── headlights ────────────────────────── */}
      <Headlight position={[-0.7, 0.38, 2.35]} />
      <Headlight position={[0.7, 0.38, 2.35]} />

      {/* ── taillights ────────────────────────── */}
      <Taillight position={[-0.8, 0.38, -2.35]} />
      <Taillight position={[0.8, 0.38, -2.35]} />

      {/* ── side mirrors ──────────────────────── */}
      <SideMirror position={[1.05, 0.65, 0.65]} />
      <SideMirror position={[-1.05, 0.65, 0.65]} />

      {/* ── wheels ────────────────────────────── */}
      <Wheel position={[-1.05, 0.12, 1.4]} />
      <Wheel position={[1.05, 0.12, 1.4]} />
      <Wheel position={[-1.05, 0.12, -1.4]} />
      <Wheel position={[1.05, 0.12, -1.4]} />

      {/* ── door lines ────────────────────────── */}
      <DoorLine side="left" z={0.15} />
      <DoorLine side="right" z={0.15} />

      {/* ── roof rail ─────────────────────────── */}
      <mesh position={[0, 1.06, -0.1]}>
        <boxGeometry args={[0.03, 0.02, 1.4]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

/* ── sub-parts ────────────────────────────────────────────── */

function Wheel({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z -= delta * 1.5;
  });

  const spokeCount = 5;

  return (
    <group position={position}>
      <group ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        {/* tyre */}
        <mesh>
          <torusGeometry args={[0.25, 0.1, 16, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.85} metalness={0.1} />
        </mesh>

        {/* rim disc */}
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.95}
            roughness={0.08}
          />
        </mesh>

        {/* spokes */}
        {Array.from({ length: spokeCount }).map((_, i) => {
          const angle = (i / spokeCount) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * 0.12,
                0,
                Math.sin(angle) * 0.12,
              ]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[0.03, 0.06, 0.18]} />
              <meshStandardMaterial
                color="#d0d0d0"
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
          );
        })}

        {/* centre cap */}
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
          <meshStandardMaterial
            color="#20E0FF"
            emissive="#20E0FF"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* brake disc (visible behind wheel) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
        <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Headlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* housing */}
      <mesh>
        <boxGeometry args={[0.35, 0.12, 0.08]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* lens */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#20E0FF"
          emissiveIntensity={3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* DRL strip */}
      <mesh position={[0, -0.07, 0.04]}>
        <boxGeometry args={[0.28, 0.015, 0.02]} />
        <meshStandardMaterial
          color="#20E0FF"
          emissive="#20E0FF"
          emissiveIntensity={2.5}
        />
      </mesh>
    </group>
  );
}

function Taillight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* housing */}
      <mesh>
        <boxGeometry args={[0.3, 0.1, 0.06]} />
        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* lens */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[0.26, 0.07, 0.02]} />
        <meshStandardMaterial
          color="#ff1a1a"
          emissive="#ff0000"
          emissiveIntensity={2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* LED bar */}
      <mesh position={[0, -0.04, -0.03]}>
        <boxGeometry args={[0.24, 0.012, 0.02]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

function SideMirror({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* arm */}
      <mesh>
        <boxGeometry args={[0.08, 0.02, 0.04]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* mirror housing */}
      <mesh position={[position[0] > 0 ? 0.06 : -0.06, 0, 0]}>
        <boxGeometry args={[0.07, 0.06, 0.05]} />
        <meshPhysicalMaterial
          color="#0A1A2E"
          metalness={0.85}
          roughness={0.12}
          clearcoat={0.6}
        />
      </mesh>
    </group>
  );
}

function DoorLine({ side, z }: { side: "left" | "right"; z: number }) {
  const x = side === "left" ? 1.01 : -1.01;
  return (
    <mesh position={[x, 0.55, z]}>
      <boxGeometry args={[0.005, 0.45, 0.01]} />
      <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

/* ── showroom environment ─────────────────────────────────── */

function NeonLights() {
  return (
    <>
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2.5}
        color="#20E0FF"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-5, 8, -5]}
        angle={0.3}
        penumbra={1}
        intensity={1.2}
        color="#14649B"
      />
      <spotLight
        position={[0, 6, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.8}
        color="#ffffff"
      />
      <pointLight position={[3, 2, 2]} intensity={0.4} color="#20E0FF" />
      <pointLight position={[-3, 2, -2]} intensity={0.3} color="#00F0FF" />
      <ambientLight intensity={0.2} />
    </>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.015;
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
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function ShowroomFloor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={0.8}
        depthScale={1.5}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.5}
        color="#0D0D0D"
        metalness={0.6}
      />
    </mesh>
  );
}

/* ── loading ──────────────────────────────────────────────── */

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full animate-spin mx-auto mb-4" />
        <p className="font-orbitron text-sm text-silver-chrome">
          Loading 3D Experience...
        </p>
      </div>
    </div>
  );
}

/* ── main component ───────────────────────────────────────── */

interface CarShowroomProps {
  className?: string;
  autoRotate?: boolean;
  enableZoom?: boolean;
  color?: string;
}

export default function CarShowroom({
  className = "",
  autoRotate = true,
  enableZoom = true,
  color = "#0A1A2E",
}: CarShowroomProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [5, 3, 5], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <fog attach="fog" args={["#0D0D0D", 12, 35]} />

          <NeonLights />
          <FloatingParticles />
          <CarBody color={color} />

          <Float
            speed={1.5}
            rotationIntensity={0}
            floatIntensity={0.3}
            floatingRange={[0, 0.08]}
          >
            <ShowroomFloor />
          </Float>

          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.5}
            scale={25}
            blur={2.5}
            far={4}
          />

          <Environment preset="night" />

          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            enablePan={false}
            enableZoom={enableZoom}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
