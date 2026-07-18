"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

const HeroCarScene = dynamic(() => import("@/components/three/HeroCarScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full animate-spin mx-auto mb-3" />
        <p className="font-inter text-xs text-silver-chrome">Loading 3D...</p>
      </div>
    </div>
  ),
});

export default function Hero() {
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setShowScroll(window.scrollY < 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Soft animated gradient orbs */}
      <div
        className="hero-orb absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #20E0FF 0%, transparent 70%)",
          animation: "heroOrb1 20s ease-in-out infinite",
        }}
      />
      <div
        className="hero-orb absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[100px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #14649B 0%, transparent 70%)",
          animation: "heroOrb2 25s ease-in-out infinite",
        }}
      />

      {/* Content - Split Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
                <span className="font-inter text-xs text-electric-cyan font-medium tracking-wider uppercase">
                  Rent a Car in Islamabad & Rawalpindi
                </span>
              </motion.div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  <span style={{ color: "var(--text-primary)" }}>DRIVE</span>
                  <br />
                  <span className="text-gradient">YOUR DREAMS</span>
                </h1>
                <p className="font-inter text-lg text-theme-secondary max-w-lg leading-relaxed">
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

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                {[
                  { value: "5.0", label: "Google Rating" },
                  { value: "30+", label: "Happy Clients" },
                  { value: "24/7", label: "Availability" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <div className="font-orbitron text-2xl font-bold text-gradient">
                      {stat.value}
                    </div>
                    <div className="font-inter text-xs text-theme-secondary">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - 3D Car Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="h-[50vh] lg:h-[70vh] w-full"
          >
            <HeroCarScene className="w-full h-full" />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScroll && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-inter text-xs text-theme-secondary tracking-wider">
            SCROLL TO EXPLORE
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-electric-cyan" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
