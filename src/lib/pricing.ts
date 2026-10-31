import type { Car } from "@/types";
import { isCalendarDate } from "./bookingDates";

export interface PriceBreakdown {
  days: number;
  total: number;
  /** Human-readable summary of how the total was built. */
  label: string;
}

/** All rentals are billed at the vehicle's daily rate. */
export function priceCar(car: Car, days: number): PriceBreakdown {
  const safeDays = Number.isFinite(days) ? Math.max(0, Math.floor(days)) : 0;

  return {
    days: safeDays,
    total: safeDays * car.pricePerDay,
    label: safeDays > 0 ? `${safeDays} day${safeDays === 1 ? "" : "s"}` : "No dates selected",
  };
}

/** Number of rental days between two YYYY-MM-DD strings, 0 when invalid. */
export function rentalDays(pickupDate: string, returnDate: string): number {
  if (!isCalendarDate(pickupDate) || !isCalendarDate(returnDate)) return 0;
  const start = Date.parse(`${pickupDate}T00:00:00Z`);
  const end = Date.parse(`${returnDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86400000));
}

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}
