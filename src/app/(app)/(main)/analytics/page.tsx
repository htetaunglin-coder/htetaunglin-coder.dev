import type { Metadata } from "next";
import {
  getWebAnalyticsReport,
  REPORT_DAYS,
} from "@/features/analytics/api/web-analytics";
import { AnalyticsView } from "@/features/analytics/components/analytics-view";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics",
  description: `Who visited this site in the last ${REPORT_DAYS} days, and from where.`,
  // Linked from the header's More panel, but kept out of search results.
  robots: { index: false, follow: true },
  alternates: {
    canonical: absoluteUrl("/analytics"),
  },
};

export const revalidate = 3600;

export default async function AnalyticsPage() {
  const result = await getWebAnalyticsReport();
  return <AnalyticsView result={result} />;
}
