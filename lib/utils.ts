import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with proper Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Japanese locale with optional digits
 */
export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString('ja-JP', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/**
 * Format weight in kg to appropriate unit (kg, t)
 */
export function formatWeight(weightInKg: number): string {
  if (weightInKg >= 1000) {
    return `${(weightInKg / 1000).toFixed(2)} t`;
  }
  return `${weightInKg.toFixed(0)} kg`;
}

/**
 * Format date to Japanese format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to YYYY-MM format
 */
export function formatYearMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get the start and end date of a month
 */
export function getMonthRange(yearMonth: string): { start: Date; end: Date } {
  const [year, month] = yearMonth.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}