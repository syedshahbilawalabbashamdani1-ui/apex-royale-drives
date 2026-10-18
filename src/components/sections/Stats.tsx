import { cars } from "@/lib/cars";
import { RATING } from "@/lib/constants";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const stats = [
  { value: RATING.value, label: "Google rating" },
  { value: String(cars.length), label: "Vehicles in fleet" },
  { value: "24/7", label: "Availability" },
  { value: "2", label: "Cities served" },
];

export default function Stats() {
  return (
    <section aria-label="Company at a glance">
      {/* gap-px over a line-coloured parent renders 1px dividers between cells */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line">
          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="bg-background px-6 sm:px-12 py-12"
            >
              <div className="text-4xl sm:text-5xl font-medium tracking-[-0.03em] text-text">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted">{stat.label}</div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}