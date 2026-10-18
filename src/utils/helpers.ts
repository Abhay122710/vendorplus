/**
 * Utility helpers used across the application.
 * Keeps component files focused on presentation logic.
 */

/**
 * Format a number as Indian Rupee currency string.
 * e.g. formatINR(247140) → "₹2,47,140"
 */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Clamp a number between min and max bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Safely parse a number from a string, returning 0 if invalid.
 */
export function safeNumber(value: string | undefined): number {
  if (!value) return 0;
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

/**
 * Truncate text to a max length, adding ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}
