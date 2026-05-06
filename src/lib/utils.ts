import axios from 'axios';
import type { ApiError } from '@/types';

/** Pulls a readable message out of a NestJS / Axios error. */
export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (!data?.message) return 'Something went wrong. Please try again.';
    return Array.isArray(data.message) ? data.message[0] : data.message;
  }
  return 'Something went wrong. Please try again.';
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Join class names, filtering out falsy values. */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
