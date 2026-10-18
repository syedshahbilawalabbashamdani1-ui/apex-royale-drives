"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePointerTilt } from "@/components/motion/usePointerTilt";

export default function HeroVehicle({ className }: { className?: string }) {
  const tilt = usePointerTilt();
  return (
    <div className={cn("car-stage relative", className)}
      onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.reset} onPointerCancel={tilt.reset}>
      <motion.div className="car-tilt"
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}>
        <div className="car-body">
          <Image
            src="/Images/Homepage/Homepage-Image-Hero-Image.png"
            alt="Black Audi available to rent with a professional driver"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain select-none"
            draggable={false}
            preload
          />
        </div>
      </motion.div>
    </div>
  );
}
