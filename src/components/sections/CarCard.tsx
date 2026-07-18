"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Car } from "@/types";
import {
  Users,
  Luggage,
  Gauge,
  Fuel,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CarCardProps {
  car: Car;
  index?: number;
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/car/${car.id}`}>
        <div className="card-dark overflow-hidden hover:border-electric-cyan/30 transition-all duration-300 hover:shadow-cyan-glow">
          {/* Image */}
          <div className="relative h-48 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
            {/* Real Image */}
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0]}
                alt={car.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${car.color}22, ${car.color}44)`,
                }}
              />
            )}

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 rounded-full bg-carbon-black/80 backdrop-blur-sm text-xs font-inter font-medium text-electric-cyan border border-electric-cyan/20">
                {car.category}
              </span>
            </div>

            {/* Popular Badge */}
            {car.popular && (
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 rounded-full bg-gradient-brand text-xs font-inter font-medium text-theme-primary">
                  Popular
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-electric-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Title */}
            <div>
              <h3 className="font-orbitron text-lg font-bold group-hover:text-electric-cyan transition-colors" style={{ color: "var(--text-primary)" }}>
                {car.name}
              </h3>
              <p className="font-inter text-sm" style={{ color: "var(--text-secondary)" }}>
                {car.brand} &bull; {car.year}
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-theme-secondary">
                <Users className="w-4 h-4 text-electric-cyan/60" />
                <span className="font-inter text-xs">{car.seats}</span>
              </div>
              <div className="flex items-center gap-2 text-theme-secondary">
                <Luggage className="w-4 h-4 text-electric-cyan/60" />
                <span className="font-inter text-xs">{car.luggage}</span>
              </div>
              <div className="flex items-center gap-2 text-theme-secondary">
                <Gauge className="w-4 h-4 text-electric-cyan/60" />
                <span className="font-inter text-xs">
                  {car.transmission === "Automatic" ? "Auto" : "Manual"}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "var(--border-primary)" }} />

            {/* Price & CTA */}
            <div className="flex items-end justify-between">
              <div>
                <span className="font-orbitron text-xl font-bold text-gradient">
                  Rs. {car.pricePerDay.toLocaleString()}
                </span>
                <span className="font-inter text-xs text-theme-secondary ml-1">
                  / day
                </span>
              </div>
              <div className="flex items-center gap-1 text-electric-cyan font-inter text-sm font-medium group-hover:gap-2 transition-all">
                <span>Details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
