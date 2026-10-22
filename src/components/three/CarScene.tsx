"use client";

import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";
import { useTheme } from "@/components/layout/ThemeProvider";
import ProceduralCar from "./ProceduralCar";

/** Pulls the camera back on entry, then hands control back to OrbitControls. */
function EntryCamera({ reduced }: { reduced: boolean }) {
  const camera = useThree((s) => s.camera);

  useLayoutEffect(() => {
    if (reduced) return;
    const from = { z: 16, y: 6 };
    const to = { z: 7.4, y: 2.5 };
    const proxy = { ...from };

    const tween = gsap.to(proxy, {
      ...to,
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => {
        camera.position.z = proxy.z;
        camera.position.y = proxy.y;
        camera.lookAt(0, 0.95, 0);
      },
    });

    return () => {
      tween.kill();
    };
  }, [camera, reduced]);

  return null;
}

function Studio({ dark }: { dark: boolean }) {
  return (
    <>
      {/*
        No <color attach="background"> here on purpose. THREE.Color has no
        alpha channel, so any colour set as scene.background renders opaque and
        overrides the alpha:true clear colour, which paints a solid panel
        behind the car. The scene stays transparent because the canvas clears
        to alpha 0 and nothing paints a background.
      */}
      <ambientLight intensity={dark ? 0.35 : 0.55} />
      <directionalLight position={[6, 9, 4]} intensity={dark ? 1.1 : 1.35} />

      {/*
        Chrome needs an environment map to reflect. Built from Lightformers
        rather than <Environment preset> so nothing is fetched from a CDN and
        the scene works offline.
      */}
      <Environment resolution={256} frames={1}>
        <group rotation={[0, Math.PI / 5, 0]}>
          <Lightformer
            form="rect"
            intensity={5}
            position={[0, 5, -9]}
            scale={[12, 4, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="rect"
            intensity={3}
            position={[-5, 2, 1]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[8, 3, 1]}
            color="#c9d4e0"
          />
          <Lightformer
            form="rect"
            intensity={3}
            position={[5, 2, 1]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[8, 3, 1]}
            color="#c9d4e0"
          />
          <Lightformer
            form="ring"
            intensity={2.4}
            position={[0, 6, 2]}
            scale={6}
            color="#d7dbe0"
          />
        </group>
      </Environment>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={dark ? 0.62 : 0.26}
        scale={14}
        blur={2.6}
        far={3}
        resolution={512}
        color={dark ? "#000000" : "#3f3f46"}
      />
    </>
  );
}

export default function CarScene({
  onReady,
}: {
  onReady?: () => void;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const dark = theme === "dark";

  const handleCreated = useCallback(() => {
    onReady?.();
  }, [onReady]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [5.6, 2.5, 7.4], fov: 32 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), 0);
          handleCreated();
        }}
      >
        <Suspense fallback={null}>
          <Studio dark={dark} />
          <ProceduralCar bob={!reduced} />
          <EntryCamera reduced={!!reduced} />
          <OrbitControls
            makeDefault
            target={[0, 0.95, 0]}
            autoRotate={!reduced && !hovered}
            autoRotateSpeed={0.7}
            enablePan={false}
            enableZoom={false}
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.7}
            minPolarAngle={Math.PI / 3.6}
            maxPolarAngle={Math.PI / 2.15}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
