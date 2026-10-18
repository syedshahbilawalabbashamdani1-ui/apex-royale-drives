import type { Car } from "@/types";
import { formatPKR } from "@/lib/pricing";

export default function RentalRates({ car }: {
  car: Pick<Car, "pricePerDay" | "pricePerWeek" | "pricePerMonth">;
}) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
      {[
        ["Per day", car.pricePerDay],
        ["Per week", car.pricePerWeek],
        ["Per month", car.pricePerMonth],
      ].map(([label, price]) => (
        <div key={label} className="min-w-0 bg-surface-2 rounded-control p-3 flex flex-wrap items-center justify-between gap-2 sm:block sm:text-center lg:flex lg:text-left xl:block xl:text-center">
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="text-sm font-semibold tabular-nums whitespace-nowrap sm:mt-2 lg:mt-0 xl:mt-2">{formatPKR(Number(price))}</dd>
        </div>
      ))}
    </dl>
  );
}
