"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/*
  Procedural vehicle. Modelled from primitives rather than downloaded so there
  is no asset payload and no third-party licence attached to a commercial site.
  Proportions are deliberately tall and upright to sit between a full-size SUV
  and a long saloon, which matches the fleet (Land Cruiser, G-Class, Maybach)
  rather than implying a sports car we do not hire.
*/

/*
  Palette is deliberately mid-tone cool grey rather than dark. The hero sits on
  either #0a0a0a or #fafafa depending on theme, and only a mid value holds
  readable contrast against both: 7.5:1 against the dark page and 2.6:1 against
  the light one. A near-black car disappears on the dark theme.
*/
const BODY = "#9aa2ab";
const SKIRT = "#6e757d";
const GLASS = "#0a0b0d";
const CHROME = "#dfe4e9";
const TYRE = "#16181a";

const WHEEL_POS: [number, number][] = [
  [1.52, 0.95],
  [1.52, -0.95],
  [-1.52, 0.95],
  [-1.52, -0.95],
];

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      {/* tyre */}
      <mesh castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.34, 40]} />
        <meshStandardMaterial color={TYRE} roughness={0.92} metalness={0.05} />
      </mesh>
      {/* rim face */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.02, 32]} />
        <meshStandardMaterial
          color={CHROME}
          roughness={0.14}
          metalness={1}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* hub */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 20]} />
        <meshStandardMaterial color={CHROME} roughness={0.2} metalness={1} />
      </mesh>
    </group>
  );
}

export default function ProceduralCar({ bob = true }: { bob?: boolean }) {
  const group = useRef<THREE.Group>(null);

  // Shared materials keep the draw-call count and material count low.
  const materials = useMemo(
    () => ({
body: new THREE.MeshPhysicalMaterial({
        color: BODY,
        metalness: 0.72,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.1,
      }),
      skirt: new THREE.MeshPhysicalMaterial({
        color: SKIRT,
        metalness: 0.6,
        roughness: 0.42,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        envMapIntensity: 0.9,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: GLASS,
        metalness: 0.45,
        roughness: 0.05,
        envMapIntensity: 2.2,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: CHROME,
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 1.8,
      }),
      lamp: new THREE.MeshStandardMaterial({
        color: "#f2f6fa",
        emissive: "#b8cfe4",
        emissiveIntensity: 1.9,
        roughness: 0.25,
        metalness: 0.15,
      }),
      tail: new THREE.MeshStandardMaterial({
        color: "#8c1f1a",
        emissive: "#e04a3a",
        emissiveIntensity: 1.5,
        roughness: 0.35,
        metalness: 0.1,
      }),
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    if (bob) {
      // Gentle suspension bob, in phase with the contact shadow's response.
      group.current.position.y = Math.sin(t * 0.9) * 0.055;
      group.current.rotation.z = Math.sin(t * 0.9 + 0.6) * 0.006;
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* lower body */}
      <RoundedBox
        args={[4.6, 0.98, 1.96]}
        radius={0.3}
        smoothness={5}
        position={[0, 0.78, 0]}
        castShadow
        receiveShadow
        material={materials.body}
      />

{/* lower valance, grounds the silhouette so a mid-tone body still has form */}
      <RoundedBox
        args={[4.42, 0.34, 1.9]}
        radius={0.16}
        smoothness={4}
        position={[0, 0.46, 0]}
        castShadow
        receiveShadow
        material={materials.skirt}
      />

      {/* shoulder line, breaks up the slab side */}
      <RoundedBox
        args={[4.5, 0.3, 1.99]}
        radius={0.14}
        smoothness={4}
        position={[-0.02, 0.86, 0]}
        material={materials.chrome}
      />

      {/* greenhouse */}
      <RoundedBox
        args={[2.62, 0.78, 1.84]}
        radius={0.34}
        smoothness={5}
        position={[-0.2, 1.52, 0]}
        castShadow
        material={materials.glass}
      />

      {/* roof panel */}
      <RoundedBox
        args={[2.1, 0.1, 1.72]}
        radius={0.05}
        smoothness={3}
        position={[-0.24, 1.9, 0]}
        material={materials.body}
      />

      {/* bonnet and boot shoulders, break the single-box silhouette */}
      <RoundedBox
        args={[1.1, 0.24, 1.86]}
        radius={0.1}
        smoothness={4}
        position={[1.62, 1.2, 0]}
        material={materials.body}
      />
      <RoundedBox
        args={[0.7, 0.24, 1.86]}
        radius={0.1}
        smoothness={4}
        position={[-2.0, 1.2, 0]}
        material={materials.body}
      />

{/* front grille */}
      <mesh position={[2.31, 0.82, 0]} material={materials.chrome}>
        <boxGeometry args={[0.06, 0.34, 1.3]} />
      </mesh>

      {/* headlights */}
      {[-0.62, 0.62].map((z) => (
        <mesh key={z} position={[2.33, 1.0, z]} material={materials.lamp}>
          <boxGeometry args={[0.05, 0.16, 0.5]} />
        </mesh>
      ))}

      {/* tail bar */}
      <mesh position={[-2.31, 1.02, 0]} material={materials.tail}>
        <boxGeometry args={[0.05, 0.14, 1.66]} />
      </mesh>

      {/* sill accent, the one place the brand chrome is used as a line */}
      {[-0.98, 0.98].map((z) => (
        <mesh key={z} position={[0, 0.44, z]} material={materials.chrome}>
          <boxGeometry args={[3.4, 0.05, 0.04]} />
        </mesh>
      ))}

      {WHEEL_POS.map(([x, z]) => (
        <Wheel key={`${x}-${z}`} position={[x, 0.46, z]} />
      ))}
    </group>
  );
}
