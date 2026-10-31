"use client";

import Button from "@/components/ui/Button";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cars } from "@/lib/cars";
import { formatPKR } from "@/lib/pricing";
import { Car } from "@/types";
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
import RentalRates from "@/components/sections/RentalRates";
import { Reveal } from "@/components/motion/Reveal";

const SAVED_STORAGE_KEY = "apex-saved-cars";
const SAVED_CHANGED_EVENT = "apex-saved-changed";

function readSavedIds(): string[] {
  try {
    const raw = window.localStorage.getItem(SAVED_STORAGE_KEY);
    const ids: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids)
      ? ids.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function subscribeSaved(onStoreChange: () => void) {
  window.addEventListener(SAVED_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(SAVED_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export default function CarDetailView({ car }: { car: Car }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  const isSaved = useSyncExternalStore(
    subscribeSaved,
    useCallback(() => readSavedIds().includes(car.id), [car.id]),
    () => false
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast({ id: Date.now(), message });

  const toggleSave = () => {
    const next = !isSaved;
    const updated = next
      ? [...readSavedIds(), car.id]
      : readSavedIds().filter((id) => id !== car.id);
    try {
      window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      showToast("Couldn't save your preference. Allow browser storage and try again.");
      return;
    }
    window.dispatchEvent(new Event(SAVED_CHANGED_EVENT));
    showToast(next ? "Saved to wishlist" : "Removed from wishlist");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/car/${car.id}`;
    const shareData = {
      title: `${car.name} — Apex Royale Drives`,
      text: `Check out the ${car.name} at Apex Royale Drives.`,
      url,
    };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied");
    } catch {
      showToast("Couldn't copy link");
    }
  };

  const relatedCars = cars
    .filter((c) => c.category === car.category && c.id !== car.id)
    .slice(0, 3);

  const specs = [
    { label: "Engine", value: car.engine },
    { label: "Horsepower", value: `${car.horsepower} HP` },
    { label: "Top Speed", value: car.topSpeed },
    { label: "Acceleration", value: car.acceleration },
    { label: "Transmission", value: car.transmission },
    { label: "Fuel Type", value: car.fuel },
    { label: "Seats", value: `${car.seats} passengers` },
    { label: "Luggage", value: `${car.luggage} bags` },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Breadcrumb */}
      <div className="py-4" style={{ background: "var(--bg-tertiary)" }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-sans text-sm">
            <Link href="/" className="inline-flex min-h-11 items-center gap-1 text-theme-secondary hover:underline underline-offset-4"><ArrowLeft className="w-4 h-4" aria-hidden="true" />Home</Link>
            <span aria-hidden="true" className="text-theme-secondary">/</span>
            <Link
              href="/fleet"
              className="text-theme-secondary hover:text-accent-ink transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Fleet
            </Link>
            <span style={{ color: "var(--text-secondary)", opacity: 0.5 }}>/</span>
            <span style={{ color: "var(--text-primary)" }}>{car.name}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 page-body">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: image, specs, features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div
              className="panel overflow-hidden relative h-[320px] lg:h-[420px] flex items-center justify-center"
              style={{ background: "var(--bg-secondary)" }}
            >
              <Image
                src={car.images[0]}
                alt={car.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
                priority
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={toggleSave}
                aria-pressed={isSaved}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: isSaved
                    ? "rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.12)"
                    : "var(--bg-secondary)",
                  color: isSaved ? "var(--accent)" : "var(--text-secondary)",
                  border: isSaved
                    ? "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.4)"
                    : "1px solid var(--border-primary)",
                }}
              >
                <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
                <span className="font-sans text-sm">{isSaved ? "Saved" : "Save"}</span>
              </button>
              <button
                onClick={handleShare}
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <Share2 className="w-5 h-5" />
                <span className="font-sans text-sm">Share</span>
              </button>
            </div>

            {/* Specifications */}
            <Reveal as="section" className="panel p-6">
              <h2 className="font-sans text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Specifications
              </h2>
              <dl className="space-y-3">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-4 py-2 border-b"
                    style={{ borderColor: "var(--border-primary)" }}
                  >
                    <dt className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
                      {spec.label}
                    </dt>
                    <dd className="font-sans text-sm font-medium text-right" style={{ color: "var(--text-primary)" }}>
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Features */}
            <Reveal as="section" className="panel p-6">
              <h2 className="font-sans text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Features &amp; Amenities
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent-ink flex-shrink-0" />
                    <span className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </motion.div>

          {/* Right: summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-2 border border-line font-sans text-xs text-accent-ink font-medium">
              {car.category}
            </span>

            <div>
              <h1 className="font-sans text-3xl sm:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                {car.name}
              </h1>
              <p className="font-sans text-lg mt-1" style={{ color: "var(--text-secondary)" }}>
                {car.brand} &bull; {car.year}
              </p>
            </div>

            <p className="font-sans leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {car.description}
            </p>

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
                <div key={spec.label} className="panel p-3 text-center">
                  <spec.icon className="w-5 h-5 text-accent-ink mx-auto mb-1" />
                  <div className="font-sans text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {spec.value}
                  </div>
                  <div className="font-sans text-[10px]" style={{ color: "var(--text-secondary)" }}>
                    {spec.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="panel p-6 space-y-4">
              <h2 className="font-sans text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                PRICING
              </h2>
              <RentalRates car={car} />
              <p className="font-sans text-xs" style={{ color: "var(--text-secondary)" }}>
                All rates include a professional driver. Fuel, tolls and parking are
                not included. Rentals are billed at the daily rate multiplied by
                the number of days.
              </p>
            </div>

            {car.available ? <Button href={`/booking?car=${car.id}`} className="w-full py-4 text-base">
              <Calendar className="w-5 h-5 mr-2" />
              Book This Vehicle
            </Button> : <Button disabled className="w-full py-4 text-base opacity-50">Currently unavailable</Button>}

            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", car.available ? "bg-green-500" : "bg-red-500")} />
              <span className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
                {car.available ? "Available Now" : "Currently Unavailable"}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <div className="mt-24">
            <h2 className="font-sans text-2xl font-bold mb-8" style={{ color: "var(--text-primary)" }}>
              SIMILAR <span className="text-accent-ink">VEHICLES</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCars.map((relatedCar) => (
                <Link
                  key={relatedCar.id}
                  href={`/car/${relatedCar.id}`}
                  className="panel p-4 hover:border-electric-cyan/30 transition-all group"
                >
                  <div
                    className="relative h-32 rounded-lg mb-4 overflow-hidden"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <Image
                      src={relatedCar.images[0]}
                      alt={relatedCar.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-sans text-lg font-bold group-hover:text-accent-ink transition-colors" style={{ color: "var(--text-primary)" }}>
                    {relatedCar.name}
                  </h3>
                  <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
                    {relatedCar.brand}
                  </p>
                  <div className="mt-3">
                    <span className="font-sans text-lg font-bold text-accent-ink">
                      {formatPKR(relatedCar.pricePerDay)}/day
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="px-5 py-2.5 rounded-lg font-sans text-sm"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  border: "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.35)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                }}
              >
                {toast.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
