export const PHONE_ERROR = "Enter 7–15 digits with an optional leading +; spaces, hyphens and parentheses are allowed.";

/** Format validation only; does not verify ownership or country allocation. */
export function normalizePhone(value: string): string {
  return value.trim().replace(/[\s()-]/g, "");
}

export function isValidPhone(value: string, required = true): boolean {
  const trimmed = value.trim();
  if (!trimmed) return !required;
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false;
  return /^\+?\d{7,15}$/.test(normalizePhone(trimmed));
}
