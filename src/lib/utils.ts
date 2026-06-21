import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { appUrl } from "./site-config";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function formatDate(
  date: Date,
  options?: {
    includeDay?: boolean;
    locale?: string;
    format?: "long" | "short" | "numeric";
  }
) {
  const {
    includeDay = false,
    locale = "en-GB",
    format = "long",
  } = options || {};

  if (includeDay && format === "numeric") {
    return date.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (includeDay) {
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: format,
      year: "numeric",
    });
  }

  return date.toLocaleString(locale, {
    year: "numeric",
    month: format,
  });
}

const PROTOCOL_REGEX = /^https?:\/\//;
const WWW_REGEX = /^www\./;
const TRAILING_SLASH_REGEX = /\/$/;

export function formatDisplayUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  return url
    .replace(PROTOCOL_REGEX, "")
    .replace(WWW_REGEX, "")
    .replace(TRAILING_SLASH_REGEX, "");
}

export function absoluteUrl(path: string) {
  return new URL(path, appUrl).toString();
}

// Career start: Pico internship, May 2024.
export const CAREER_START = "2024-05-01";

// Whole years since `start` (e.g. "2024-05-01"). Used for "X+ years of experience".
export function getYearsOfExperience(start: string = CAREER_START): number {
  const from = new Date(start);
  const now = new Date();
  let years = now.getFullYear() - from.getFullYear();
  const monthDiff = now.getMonth() - from.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < from.getDate())) {
    years--;
  }
  return years;
}
