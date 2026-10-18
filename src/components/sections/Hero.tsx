"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HeroVehicle from "./HeroVehicle";
import { MagneticLink } from "@/components/motion/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section
      className="relative flex items-center overflow-hidden min-h-[calc(100dvh-var(--header-h))]"
      aria-labelledby="hero-heading"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="max-w-xl">
            <motion.p
              {...rise(0)}
              className="text-xs uppercase tracking-[0.18em] text-muted mb-6"
            >
              Rent a car in Islamabad and Rawalpindi
            </motion.p>

            <motion.h1
              {...rise(0.08)}
              id="hero-heading"
              className="text-5xl sm:text-6xl lg:text-7xl font-medium leading-[0.95] tracking-[-0.03em]"
            >
              Drive the car
              <br />
              you actually want
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="mt-8 text-lg text-muted leading-relaxed max-w-[46ch]"
            >
              Seven vehicles, all with a professional driver. Daily rates,
              confirmed on WhatsApp in minutes.
            </motion.p>

            <motion.div {...rise(0.24)} className="mt-12 flex flex-wrap gap-3">
              <MagneticLink href="/booking" strength={0.2}>
                Book your vehicle
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </MagneticLink>
              <MagneticLink href="/fleet" variant="ghost" strength={0.2}>
                See the fleet
              </MagneticLink>
            </motion.div>
          </div>

          {/* Audi hero image */}
          <motion.div
            className="relative aspect-[4/3] lg:aspect-[5/4]"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          >
            <HeroVehicle className="absolute inset-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
