import type { BookingFormData } from "../types";
import { isValidPhone, PHONE_ERROR } from "./phone";

export function validateBookingContact(data: Pick<BookingFormData, "firstName" | "lastName" | "email" | "phone">) {
  const errors: { firstName?: string; lastName?: string; email?: string; phone?: string } = {};
  if (!data.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!data.lastName.trim()) errors.lastName = "Enter your last name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }
  if (!isValidPhone(data.phone)) errors.phone = PHONE_ERROR;
  return errors;
}
