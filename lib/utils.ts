import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into UGX currency display format
 * Example: 650000 -> "UGX 650,000"
 */
export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

/**
 * Generates a clean human-readable order number
 * Example: "ESS-20260919-001"
 */
export function generateOrderNumber(sequence: number): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const paddedSeq = String(sequence).padStart(3, "0");
  return `ESS-${dateStr}-${paddedSeq}`;
}

/**
 * Normalizes phone numbers to Ugandan international format (+256...)
 */
export function normalizeUgandaPhone(phone: string): string {
  const cleaned = phone.replace(/\s+|-|\+/g, "");
  if (cleaned.startsWith("07") && cleaned.length === 10) {
    return `+256${cleaned.substring(1)}`;
  }
  if (cleaned.startsWith("256") && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("+256") && cleaned.length === 13) {
    return cleaned;
  }
  return phone; // Return as-is if pattern doesn't match standard UG formats
}
