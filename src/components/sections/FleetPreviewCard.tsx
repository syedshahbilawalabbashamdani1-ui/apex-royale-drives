import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Car } from "@/types";
import { formatPKR } from "@/lib/pricing";

export default function FleetPreviewCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/car/${car.id}`}
      className="group block min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 33vw, 100vw"
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <h3 className="text-xl font-medium tracking-[-0.02em]">{car.name}</h3>
          <p className="mt-2 text-sm text-muted">
            {formatPKR(car.pricePerDay)} <span>/ day</span>
          </p>
        </div>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
      </div>
    </Link>
  );
}
