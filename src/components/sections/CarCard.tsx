"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types";
import { formatPKR } from "@/lib/pricing";
import { Users, Luggage, Gauge } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * `feature` is the tall lead card. Its image flexes to absorb whatever height
 * the grid row gives it, so the cell never ends with dead space underneath the
 * content. Below md there is no row height to flex into, so it falls back to a
 * fixed aspect ratio.
 */
export default function CarCard({
  car,
  index = 0,
  variant = "default",
  priority = false,
}: {
  car: Car;
  index?: number;
  variant?: "default" | "feature";
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const isFeature = variant === "feature";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: reduce ? 0 : index * 0.06,
        ease: EASE,
      }}
      className="group h-full"
    >
      <Link
        href={`/car/${car.id}`}
        className="panel panel-lift overflow-hidden h-full flex flex-col"
        aria-label={`${car.name}, ${formatPKR(car.pricePerDay)} per day`}
      >
        <div
          className={
            isFeature
              ? "relative overflow-hidden bg-surface-2 aspect-[4/3] md:aspect-auto md:flex-1 md:min-h-[260px]"
              : "relative aspect-[16/10] overflow-hidden bg-surface-2"
          }
        >
          <Image
            src={car.images[0]}
            alt={car.name}
            fill
            sizes={
              isFeature
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority={priority}
          />
          <span
            className="absolute top-4 left-4 px-3 py-1 text-xs text-text"
            style={{
              background: "var(--color-background-ref)",
              border: "1px solid var(--color-line-ref)",
            }}
          >
            {car.category}
          </span>
        </div>

        <div className={isFeature ? "p-6 lg:p-8" : "p-6"}>
          <div
            className={
              isFeature
                ? "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
                : "flex flex-col items-start gap-3"
            }
          >
            <div className="min-w-0">
              <h3
                className={
                  isFeature
                    ? "text-2xl lg:text-3xl font-medium tracking-[-0.02em] truncate"
                    : "text-xl font-medium tracking-[-0.02em] break-words"
                }
              >
                {car.name}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {car.brand}, {car.year}
              </p>
            </div>
            <div className={isFeature ? "sm:text-right shrink-0" : "shrink-0"}>
              <div className={isFeature ? "text-xl font-medium text-text" : "text-lg font-medium text-text"}>
                {formatPKR(car.pricePerDay)}
              </div>
              <div className="text-xs text-muted">per day</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" aria-hidden="true" />
              {car.seats}
            </span>
            <span className="flex items-center gap-2">
              <Luggage className="w-4 h-4" aria-hidden="true" />
              {car.luggage}
            </span>
            <span className="flex items-center gap-2">
              <Gauge className="w-4 h-4" aria-hidden="true" />
              {car.transmission === "Automatic" ? "Auto" : "Manual"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
