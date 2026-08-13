"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cars } from "@/lib/cars";
import CarCard from "./CarCard";
import { ArrowRight } from "lucide-react";

export default function FleetGrid() {
  const featuredCars = cars.filter((car) => car.popular).slice(0, 3);

  return (
    <section className="py-24" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <span className="font-sans text-sm text-electric-cyan font-medium tracking-wider uppercase">
            Our Fleet
          </span>
          <h2 className="font-general-sans text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            FEATURED <span className="text-gradient">VEHICLES</span>
          </h2>
          <p className="font-sans max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Choose from our collection of luxury SUVs, premium sedans, and
            family cars. Each vehicle is clean, well-maintained, and ready for
            your next journey.
          </p>
        </motion.div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/fleet"
            className="inline-flex items-center gap-2 text-electric-cyan font-sans font-medium hover:gap-3 transition-all group"
          >
            <span>View All Vehicles</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
