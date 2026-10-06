import { identifyReferrer, type ReferrerSource } from "../lib/referrers";

const AGGREGATE_URL =
  "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
/** Hobby keeps one month of Web Analytics data, so a longer window has gaps. */
export const REPORT_DAYS = 30;
const REFERRER_LIMIT = 6;
// Several hosts can merge into one source (l.facebook.com, m.facebook.com), so
// the API returns more rows than the page shows. The country map shows all of
// them.
const QUERY_LIMIT = 20;
/** The API rolls every value past `limit` into one row with this label. */
const OTHERS_LABEL = "Others";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

type VisitCounts = { visitors: number; pageviews: number };

/** One UTC day. Days without traffic are present with zero counts. */
export type DailyVisits = VisitCounts & { date: string };

type RankedVisits = VisitCounts & { label: string };

export type ReferrerVisits = RankedVisits & { source: ReferrerSource };

/** `code` is the ISO 3166-1 alpha-2 code, or "" when Vercel has no country. */
export type CountryVisits = RankedVisits & { code: string };

export type WebAnalyticsReport = {
  /** First day of the window, inclusive, as `YYYY-MM-DD` in UTC. */
  since: string;
  /** Last day of the window, inclusive. Today, so its counts are partial. */
  until: string;
  totals: VisitCounts;
  daily: DailyVisits[];
  referrers: ReferrerVisits[];
  countries: CountryVisits[];
};

export type WebAnalyticsResult =
  | { ok: true; report: WebAnalyticsReport }
  | { ok: false; message: string };

type Dimension = "day" | "referrerHostname" | "country";

type DateRange = { since: string; until: string };

type AggregateRow = VisitCounts & Partial<Record<Dimension, string>>;

type AggregateResponse = { data: (AggregateRow & { timestamp?: string })[] };

type Credentials = { token: string; projectId: string; teamId: string };

/**
 * Reads the last {@link REPORT_DAYS} days of production traffic. Responses are
 * cached for an hour. Never throws: a missing key or a failed request returns
 * a message that is safe to show visitors.
 */
export async function getWebAnalyticsReport(): Promise<WebAnalyticsResult> {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  // Vercel sets VERCEL_PROJECT_ID on every deployment. Local runs need it in .env.
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!(token && projectId && teamId)) {
    return {
      ok: false,
      message: "Visitor numbers are not connected yet. Check back soon.",
    };
  }

  const credentials = { token, projectId, teamId };
  const range = lastDays(REPORT_DAYS);

  try {
    const [daily, referrers, countries] = await Promise.all([
      queryVisits("day", range, credentials),
      queryVisits("referrerHostname", range, credentials),
      queryVisits("country", range, credentials),
    ]);

    const dailyVisits = daily.map((row) => ({
      date: (row.timestamp ?? "").slice(0, "YYYY-MM-DD".length),
      visitors: row.visitors,
      pageviews: row.pageviews,
    }));

    return {
      ok: true,
      report: {
        ...range,
        totals: {
          visitors: sum(dailyVisits, "visitors"),
          pageviews: sum(dailyVisits, "pageviews"),
        },
        daily: dailyVisits,
        referrers: rankReferrers(referrers),
        countries: rankCountries(countries),
      },
    };
  } catch (error) {
    console.error("[analytics] Web Analytics query failed:", error);
    return {
      ok: false,
      message: "Visitor numbers are not available right now. Try again later.",
    };
  }
}

function lastDays(days: number): DateRange {
  const until = new Date();
  const since = new Date(until);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  return { since: toIsoDate(since), until: toIsoDate(until) };
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, "YYYY-MM-DD".length);
}

async function queryVisits(
  by: Dimension,
  range: DateRange,
  { token, projectId, teamId }: Credentials
) {
  const params = new URLSearchParams({
    projectId,
    teamId,
    by,
    ...range,
    limit: String(QUERY_LIMIT),
  });
  const res = await fetch(`${AGGREGATE_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`${by} query returned ${res.status}`);
  }
  const body = (await res.json()) as AggregateResponse;
  return body.data;
}

function sum(rows: readonly VisitCounts[], key: keyof VisitCounts) {
  return rows.reduce((total, row) => total + row[key], 0);
}

// "Others" is the sum of the tail, not one source or country, so it can
// outrank every real row. Both rankings leave it out.

// Visitor counts add up across the hosts of one site, so a visitor who came
// from two Facebook hosts counts twice. Page views add up exactly.
function rankReferrers(rows: readonly AggregateRow[]): ReferrerVisits[] {
  const bySource = new Map<string, ReferrerVisits>();
  for (const row of rows) {
    const host = row.referrerHostname ?? "";
    if (host === OTHERS_LABEL) {
      continue;
    }
    const { source, label } = identifyReferrer(host);
    const entry = bySource.get(label) ?? {
      source,
      label,
      visitors: 0,
      pageviews: 0,
    };
    entry.visitors += row.visitors;
    entry.pageviews += row.pageviews;
    bySource.set(label, entry);
  }
  return byVisitors([...bySource.values()]).slice(0, REFERRER_LIMIT);
}

function rankCountries(rows: readonly AggregateRow[]): CountryVisits[] {
  return byVisitors(
    rows
      .filter((row) => row.country !== OTHERS_LABEL)
      .map((row) => ({
        code: row.country ?? "",
        label: row.country
          ? (countryNames.of(row.country) ?? row.country)
          : "Unknown",
        visitors: row.visitors,
        pageviews: row.pageviews,
      }))
  );
}

function byVisitors<TEntry extends VisitCounts>(entries: TEntry[]) {
  return entries.sort((a, b) => b.visitors - a.visitors);
}
