import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cars } from "@/lib/cars";
import CarCard from "@/components/sections/CarCard";
import { Reveal } from "@/components/motion/Reveal";

const FEATURED = 4;

/**
 * Three-column asymmetric layout: one lead vehicle fills two columns and all
 * three stacked rows, with the other three running down the last column. Every
 * Reveal wrapper is h-full so each card fills its cell exactly, which is what
 * keeps the lead card from leaving dead space beneath its content.
 */
export default function FleetGrid() {
  const [lead, ...rest] = cars.slice(0, FEATURED);

  return (
    <section className="py-24" aria-labelledby="fleet-heading">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-16">
          <h2
            id="fleet-heading"
            className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] leading-[1.05]"
          >
            The fleet
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-[60ch]">
            Every vehicle is hired with a professional driver. Weekly and monthly
            rates are priced below the daily rate, so longer trips cost less per
            day.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal className="md:col-span-2 md:row-span-3 h-full">
            <CarCard car={lead} variant="feature" priority />
          </Reveal>

          {rest.map((car, i) => (
            <Reveal key={car.id} className="h-full" delay={0.08 * (i + 1)}>
              <CarCard car={car} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <Link
            href="/fleet"
            className="group inline-flex items-center gap-2 text-text transition-colors"
          >
            <span>View all {cars.length} vehicles</span>
            <ArrowRight
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}