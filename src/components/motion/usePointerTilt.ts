"use client";

import { useCallback, useEffect, type PointerEvent } from "react";
import { useMotionValue, useSpring } from "framer-motion";

const spring = { stiffness: 140, damping: 24, mass: 0.7 };

export function usePointerTilt() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, spring);
  const rotateY = useSpring(y, spring);
  const reset = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      reducedMotion.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [reset]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const horizontal = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const vertical = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    x.set(-vertical * 5);
    y.set(horizontal * 8);
  };

  return { rotateX, rotateY, onPointerMove, reset };
}
