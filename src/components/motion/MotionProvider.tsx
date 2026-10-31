"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
