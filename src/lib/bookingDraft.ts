import type { BookingFormData } from "../types";
import { validateBookingDates } from "./bookingDates";
import { validateBookingContact } from "./bookingContact";

export const BOOKING_DRAFT_KEY = "apex-booking-draft-v1";

export function emptyBooking(initialCarId?: string): BookingFormData {
  return {
    carIds: initialCarId ? [initialCarId] : [], customCarNames: [],
    pickupDate: "", returnDate: "", pickupLocation: "",
    firstName: "", lastName: "", email: "", phone: "", message: "",
  };
}

/** Browser storage is untrusted; restore only known fields and bookable vehicles. */
export function restoreBookingDraft(
  raw: string | null,
  availableCarIds: string[],
  locations: string[],
  initialCarId?: string,
  now = Date.now(),
): { formData: BookingFormData; step: number } {
  const formData = emptyBooking(initialCarId);
  const fallback = { formData, step: initialCarId ? 2 : 1 };
  if (!raw) return fallback;
  try {
    const draft: unknown = JSON.parse(raw);
    if (!draft || typeof draft !== "object" || !("formData" in draft) || !("version" in draft) || draft.version !== 1) return fallback;
    if (!draft.formData || typeof draft.formData !== "object") return fallback;
    const data = draft.formData as Record<string, unknown>;
    for (const field of ["pickupDate", "returnDate", "pickupLocation", "firstName", "lastName", "email", "phone", "message"] as const) {
      if (field in data && typeof data[field] === "string") formData[field] = data[field];
    }
    if (!locations.includes(formData.pickupLocation)) formData.pickupLocation = "";
    if ("carIds" in data && Array.isArray(data.carIds)) {
      formData.carIds = [...new Set(data.carIds.filter((id): id is string => typeof id === "string" && availableCarIds.includes(id)))];
    }
    if ("customCarNames" in data && Array.isArray(data.customCarNames)) {
      formData.customCarNames = data.customCarNames
        .filter((name): name is string => typeof name === "string")
        .map((name) => name.trim().slice(0, 120)).filter(Boolean);
    }
    const addedFromLink = initialCarId && !formData.carIds.includes(initialCarId);
    if (addedFromLink) formData.carIds.push(initialCarId);
    const selected = formData.carIds.length + formData.customCarNames.length > 0;
    const validDates = Object.keys(validateBookingDates(formData.pickupDate, formData.returnDate, now)).length === 0 && !!formData.pickupLocation;
    const validContact = Object.keys(validateBookingContact(formData)).length === 0;
    const maxStep = !selected ? 1 : !validDates ? 2 : !validContact ? 3 : 4;
    const requestedStep = "step" in draft && typeof draft.step === "number" && Number.isInteger(draft.step)
      ? Math.max(1, Math.min(4, draft.step)) : 1;
    return { formData, step: addedFromLink ? 2 : Math.min(requestedStep, maxStep) };
  } catch {
    return fallback;
  }
}
