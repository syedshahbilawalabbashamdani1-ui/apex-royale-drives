import type { Car } from "@/types";
import { formatPKR } from "@/lib/pricing";

export default function RentalRates({ car }: {
  car: Pick<Car, "pricePerDay">;
}) {
  return (
    <dl className="bg-surface-2 rounded-control p-4 flex flex-wrap items-center justify-between gap-2">
      <dt className="text-sm text-muted">Per day</dt>
      <dd className="text-xl font-semibold tabular-nums">{formatPKR(car.pricePerDay)}</dd>
    </dl>
  );
}
