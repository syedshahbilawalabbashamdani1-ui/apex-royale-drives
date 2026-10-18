import { Car } from "@/types";

export interface PriceBreakdown {
  days: number;
  months: number;
  weeks: number;
  extraDays: number;
  total: number;
  /** Human-readable summary of how the total was built. */
  label: string;
}

const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;

/**
 * Builds a price from the cheapest combination of whole months, whole weeks and
 * single days. Long rentals must use the discounted monthly/weekly rates, otherwise
 * a 30-day booking would be quoted at 30x the daily rate.
 */
export function priceCar(car: Car, days: number): PriceBreakdown {
  const safeDays = Math.max(0, Math.floor(days));

  const months = Math.floor(safeDays / DAYS_PER_MONTH);
  let remainder = safeDays % DAYS_PER_MONTH;

  const weeks = Math.floor(remainder / DAYS_PER_WEEK);
  remainder %= DAYS_PER_WEEK;

  const extraDays = remainder;

  const total =
    months * car.pricePerMonth +
    weeks * car.pricePerWeek +
    extraDays * car.pricePerDay;

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? "s" : ""}`);
  if (extraDays > 0) parts.push(`${extraDays} day${extraDays > 1 ? "s" : ""}`);

  return {
    days: safeDays,
    months,
    weeks,
    extraDays,
    total,
    label: parts.length > 0 ? parts.join(" + ") : "No dates selected",
  };
}

/** Number of rental days between two YYYY-MM-DD strings, 0 when invalid. */
export function rentalDays(pickupDate: string, returnDate: string): number {
  if (!pickupDate || !returnDate) return 0;
  const start = Date.parse(`${pickupDate}T00:00:00Z`);
  const end = Date.parse(`${returnDate}T00:00:00Z`);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.round((end - start) / 86400000));
}

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}