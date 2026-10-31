import PageSection from "@/components/layout/PageSection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cars } from "@/lib/cars";
import FleetPreviewCard from "@/components/sections/FleetPreviewCard";
import { Reveal } from "@/components/motion/Reveal";

const featuredCars = cars.slice(0, 3);

export default function FleetGrid() {
  return (
    <PageSection aria-labelledby="fleet-heading">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="section-heading flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="fleet-heading" className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              The fleet
            </h2>
            <p className="mt-5 max-w-lg text-muted leading-relaxed">
              Three from our fleet. A professional driver with every hire.
            </p>
          </div>
          <Link href="/fleet" className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm text-text underline-offset-4 hover:underline sm:self-auto">
            View all {cars.length} vehicles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredCars.map((car, index) => (
            <Reveal key={car.id} delay={index * 0.08} className="min-w-0">
              <FleetPreviewCard car={car} />
            </Reveal>
          ))}
        </div>
      </div>
    </PageSection>
  );
}
