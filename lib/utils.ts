import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into UGX currency display
 * e.g., 650000 -> "UGX 650,000"
 */
export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}
