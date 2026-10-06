// Fixed locale and time zone, so the server render and the hydrated chart
// print the same labels.
const countFormat = new Intl.NumberFormat("en-US");
const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatCount(value: number) {
  return countFormat.format(value);
}

/** Formats a `YYYY-MM-DD` UTC date as "Sep 7". */
export function formatDay(isoDate: string) {
  return dayFormat.format(new Date(isoDate));
}
