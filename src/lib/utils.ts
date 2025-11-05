import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function formatDate(date: Date) {
  return date.toLocaleString("en-US", { year: "numeric", month: "long" });
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
