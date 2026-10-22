export interface BookingDateErrors {
  pickupDate?: string;
  returnDate?: string;
}

/** Calendar date in Pakistan Standard Time, independent of the browser timezone. */
export function todayInPKT(now = Date.now()): string {
  return new Date(now + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000-")) return false;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

/** Recompute today on each validation, including when an open session crosses midnight. */
export function validateBookingDates(
  pickupDate: string,
  returnDate: string,
  now = Date.now(),
): BookingDateErrors {
  const errors: BookingDateErrors = {};
  if (!isCalendarDate(pickupDate)) {
    errors.pickupDate = "Enter a valid pickup date.";
  } else if (pickupDate < todayInPKT(now)) {
    errors.pickupDate = "Pickup must be today or later (Pakistan time).";
  }
  if (!isCalendarDate(returnDate)) {
    errors.returnDate = "Enter a valid return date.";
  } else if (isCalendarDate(pickupDate) && returnDate <= pickupDate) {
    errors.returnDate = "Return must be at least one day after pickup.";
  }
  return errors;
}
