"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cars } from "@/lib/cars";
import {
  Users,
  Luggage,
  Gauge,
  Fuel,
  ArrowLeft,
  Calendar,
  Check,
  Share2,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const car = cars.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<"preview" | "specs" | "features">("preview");

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center">
          <h1 className="font-orbitron text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Car Not Found
          </h1>
          <Link href="/fleet" className="btn-primary">
            Browse Fleet
          </Link>
        </div>
      </div>
    );
  }

  const relatedCars = cars
    .filter((c) => c.category === car.category && c.id !== car.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Breadcrumb */}
      <div className="py-4" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-inter text-sm">
            <Link
              href="/fleet"
              className="text-theme-secondary hover:text-electric-cyan transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Fleet
            </Link>
            <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--text-primary)" }}>{car.name}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Preview / Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-4">
              {[
                { key: "preview", label: "Preview" },
                { key: "specs", label: "Specifications" },
                { key: "features", label: "Features" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-inter text-sm font-medium transition-colors",
                    activeTab === tab.key
                      ? "bg-electric-cyan text-carbon-black"
                      : "bg-gunmetal text-theme-secondary hover:bg-gunmetal/80"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="card-dark overflow-hidden">
              {activeTab === "preview" && (
                <div className="h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <Image
                      src={car.images[0]}
                      alt={car.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center">
                      <div
                        className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: "var(--bg-secondary)" }}
                      >
                        <span className="font-orbitron text-4xl font-bold text-electric-cyan/40">
                          {car.brand.charAt(0)}
                        </span>
                      </div>
                      <p className="font-inter text-sm" style={{ color: "var(--text-secondary)" }}>
                        Images coming soon
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <div className="p-6 space-y-4">
                  <h3 className="font-orbitron text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                    Specifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Engine", value: car.engine },
                      { label: "Horsepower", value: `${car.horsepower} HP` },
                      { label: "Top Speed", value: car.topSpeed },
                      { label: "Acceleration", value: car.acceleration },
                      { label: "Transmission", value: car.transmission },
                      { label: "Fuel Type", value: car.fuel },
                      { label: "Seats", value: `${car.seats} passengers` },
                      { label: "Luggage", value: `${car.luggage} bags` },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="flex justify-between py-2 border-b"
                        style={{ borderColor: "var(--border-primary)" }}
                      >
                        <span className="font-inter text-sm" style={{ color: "var(--text-secondary)" }}>
                          {spec.label}
                        </span>
                        <span className="font-inter text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div className="p-6">
                  <h3 className="font-orbitron text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {car.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 py-2"
                      >
                        <Check className="w-4 h-4 text-electric-cyan" />
                        <span className="font-inter text-sm" style={{ color: "var(--text-secondary)" }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                <Heart className="w-5 h-5" />
                <span className="font-inter text-sm">Save</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                <Share2 className="w-5 h-5" />
                <span className="font-inter text-sm">Share</span>
              </button>
            </div>
          </motion.div>

          {/* Right: Car Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 font-inter text-xs text-electric-cyan font-medium">
              {car.category}
            </span>

            {/* Title */}
            <div>
              <h1 className="font-orbitron text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                {car.name}
              </h1>
              <p className="font-inter text-lg mt-1" style={{ color: "var(--text-secondary)" }}>
                {car.brand} &bull; {car.year}
              </p>
            </div>

            {/* Description */}
            <p className="font-inter leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {car.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: Users, value: `${car.seats}`, label: "Seats" },
                { icon: Luggage, value: `${car.luggage}`, label: "Bags" },
                {
                  icon: Gauge,
                  value: car.transmission === "Automatic" ? "Auto" : "Manual",
                  label: "Trans.",
                },
                { icon: Fuel, value: car.fuel, label: "Fuel" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="card-dark p-3 text-center"
                >
                  <spec.icon className="w-5 h-5 text-electric-cyan mx-auto mb-1" />
                  <div className="font-inter text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {spec.value}
                  </div>
                  <div className="font-inter text-[10px]" style={{ color: "var(--text-secondary)" }}>
                    {spec.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="card-dark p-6 space-y-4">
              <h3 className="font-orbitron text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                PRICING
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                  <div className="font-orbitron text-lg sm:text-xl font-bold text-gradient">
                    Rs. {car.pricePerDay.toLocaleString()}
                  </div>
                  <div className="font-inter text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    Per Day
                  </div>
                </div>
                {car.pricePerWeek && (
                  <div className="text-center p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                    <div className="font-orbitron text-lg sm:text-xl font-bold text-gradient">
                      Rs. {car.pricePerWeek.toLocaleString()}
                    </div>
                    <div className="font-inter text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      Per Week
                    </div>
                  </div>
                )}
                {car.pricePerMonth && (
                  <div className="text-center p-4 rounded-lg" style={{ background: "var(--bg-primary)" }}>
                    <div className="font-orbitron text-lg sm:text-xl font-bold text-gradient">
                      Rs. {car.pricePerMonth.toLocaleString()}
                    </div>
                    <div className="font-inter text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      Per Month
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Button */}
            <Link
              href={`/booking?car=${car.id}`}
              className="btn-primary w-full py-4 text-base"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book This Vehicle
            </Link>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  car.available ? "bg-green-500" : "bg-red-500"
                )}
              />
              <span className="font-inter text-sm" style={{ color: "var(--text-secondary)" }}>
                {car.available ? "Available Now" : "Currently Unavailable"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <div className="mt-24">
            <h2 className="font-orbitron text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
              SIMILAR <span className="text-gradient">VEHICLES</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar, index) => (
                <Link
                  key={relatedCar.id}
                  href={`/car/${relatedCar.id}`}
                  className="card-dark p-4 hover:border-electric-cyan/30 transition-all group"
                >
                  <div className="h-32 rounded-lg mb-4 overflow-hidden flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                    {relatedCar.images && relatedCar.images.length > 0 ? (
                      <Image
                        src={relatedCar.images[0]}
                        alt={relatedCar.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-orbitron text-3xl font-bold text-electric-cyan/30">
                        {relatedCar.brand.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-orbitron text-lg font-bold group-hover:text-electric-cyan transition-colors" style={{ color: "var(--text-primary)" }}>
                    {relatedCar.name}
                  </h3>
                  <p className="font-inter text-sm" style={{ color: "var(--text-secondary)" }}>
                    {relatedCar.brand}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-orbitron text-lg font-bold text-gradient">
                      Rs. {relatedCar.pricePerDay.toLocaleString()}/day
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
