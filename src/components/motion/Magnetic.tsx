"use client";

import { useCallback, type PointerEvent, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Magnetic pull on hover.
 *
 * Pointer position is tracked with motion values rather than React state, so
 * tracking never triggers a re-render. The target element is read from the
 * event's `currentTarget`, which keeps this ref-free. Disabled entirely under
 * prefers-reduced-motion.
 */
function useMagnetic(strength: number) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reduce) return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set(
        (event.clientX - rect.left - rect.width / 2) * strength
      );
      y.set(
        (event.clientY - rect.top - rect.height / 2) * strength
      );
    },
    [reduce, strength, x, y]
  );

  const onPointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    x: springX,
    y: springY,
    onPointerMove,
    onPointerLeave,
    disabled: !!reduce,
  };
}

type Variant = "primary" | "ghost";

export function MagneticLink({
  href,
  children,
  variant = "primary",
  strength = 0.25,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  strength?: number;
  className?: string;
}) {
  const m = useMagnetic(strength);

  return (
    <motion.div
      style={m.disabled ? undefined : { x: m.x, y: m.y }}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      className="inline-flex"
    >
      <Button href={href} variant={variant} className={className}>
        {children}
      </Button>
    </motion.div>
  );
}

export function MagneticButton({
  onClick,
  children,
  variant = "primary",
  strength = 0.25,
  type = "button",
  className = "",
  ariaLabel,
}: {
  onClick?: () => void;
  children: ReactNode;
  variant?: Variant;
  strength?: number;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
}) {
  const m = useMagnetic(strength);

  return (
    <motion.div
      style={m.disabled ? undefined : { x: m.x, y: m.y }}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      className="inline-flex"
    >
      <Button
        type={type}
        onClick={onClick}
        aria-label={ariaLabel}
        variant={variant}
        className={className}
      >
        {children}
      </Button>
    </motion.div>
  );
}
