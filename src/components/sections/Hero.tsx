"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

/* ── animated counter ─────────────────────────────────────── */

function useCountUp(target: number, decimals: number, inView: boolean) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const duration = 1400;

  const animate = useCallback(
    (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    },
    [target],
  );

  useEffect(() => {
    if (inView) {
      startRef.current = null;
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, animate]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value);
}

function AnimatedStat({
  value,
  label,
  inView,
  delay,
}: {
  value: string;
  label: string;
  inView: boolean;
  delay: number;
}) {
  const numMatch = value.match(/^([\d.]+)(.*)$/);
  const target = numMatch ? parseFloat(numMatch[1]) : 0;
  const suffix = numMatch ? numMatch[2] : "";
  const decimals = numMatch && numMatch[1].includes(".") ? 1 : 0;
  const count = useCountUp(target, decimals, inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="font-general-sans text-2xl font-bold text-gradient">
        {count}
        {suffix}
      </div>
      <div className="font-sans text-xs text-theme-secondary">{label}</div>
    </motion.div>
  );
}

/* ── hero ─────────────────────────────────────────────────── */

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  const [indicatorOpacity, setIndicatorOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIndicatorOpacity(y < 80 ? 1 - y / 80 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Subtle warm glow */}
      <div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[100px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #92702A 0%, transparent 70%)",
        }}
      />

      {/* Content - Split Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left - Text Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/20"
              >
                <span className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
                <span className="font-sans text-xs text-electric-cyan font-medium tracking-wider uppercase">
                  Rent a Car in Islamabad & Rawalpindi
                </span>
              </motion.div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="font-general-sans text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span style={{ color: "var(--text-primary)" }}>DRIVE</span>
                  <br />
                  <span className="font-medium text-gradient">YOUR DREAMS</span>
                </h1>
                <p className="font-sans text-lg text-theme-secondary max-w-lg leading-relaxed">
                  Trusted rent-a-car service in Islamabad and Rawalpindi.
                  Luxury and affordable vehicles with professional drivers,
                  24/7 support, and airport transfers.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/fleet" className="btn-primary">
                  Explore Fleet
                </Link>
                <Link href="/booking" className="btn-secondary">
                  Book Now
                </Link>
              </div>

              {/* Stats (count-up) */}
              <div ref={statsRef} className="flex gap-8 pt-4">
                <AnimatedStat
                  value="5.0"
                  label="Google Rating"
                  inView={statsInView}
                  delay={0.6}
                />
                <AnimatedStat
                  value="30+"
                  label="Happy Clients"
                  inView={statsInView}
                  delay={0.7}
                />
                <AnimatedStat
                  value="24/7"
                  label="Availability"
                  inView={statsInView}
                  delay={0.8}
                />
              </div>
            </motion.div>
          </div>

          {/* Right - Hero Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="relative h-[50vh] lg:h-[70vh] w-full flex items-center justify-center"
          >
            {/* Glow behind car */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[60%] bg-electric-cyan/8 rounded-full blur-[80px]" />
            </div>

            {/* Car image */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full"
            >
              <Image
                src="/Images/Homepage/Homepage-Image-Hero-Image.png"
                alt="Premium luxury car - Apex Royale Drives"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Animated ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[15%] border border-electric-cyan/10 rounded-full pointer-events-none"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - fades out as you scroll */}
      <div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-150"
      >
        <span className="font-sans text-xs text-theme-secondary tracking-wider">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-electric-cyan" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
