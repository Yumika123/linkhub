import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to validate a hex color string
 * Returns true if the string is a valid hex color, false otherwise
 */
export function isValidHex(hex: string) {
  return /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);
}
