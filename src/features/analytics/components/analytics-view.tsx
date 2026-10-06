import type { ReactNode } from "react";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import type {
  ReferrerVisits,
  WebAnalyticsReport,
  WebAnalyticsResult,
} from "../api/web-analytics";
import { REPORT_DAYS } from "../api/web-analytics";
import { formatCount, formatDay } from "../lib/format";
import { referrerIcon } from "../lib/referrers";
import { DailyVisitorsChart } from "./analytics-charts";
import { CountryMap } from "./country-map";

type AnalyticsViewProps = { result: WebAnalyticsResult };

export function AnalyticsView({ result }: AnalyticsViewProps) {
  return (
    // Full width, so the dotted lane in Report can run edge to edge as on the
    // projects page. Each block keeps the 3xl column on its own.
    <main className="pt-4 pb-8 font-inter sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-0">
        <p className="font-gloria-hallelujah text-fg-tertiary/80 text-xs uppercase italic tracking-normal sm:text-sm">
          # Analytics
        </p>
        <h1 className="mt-3 bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-bold text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80">
          Visitors
        </h1>
        <p className="mt-2 max-w-xl font-medium text-base text-neutral-900/80 tracking-tight sm:text-lg/normal dark:text-fg-tertiary">
          Who visited in the last {REPORT_DAYS} days, and from where.
        </p>

        {result.ok ? null : (
          <p className="mt-12 text-fg-tertiary">{result.message}</p>
        )}
      </div>

      {result.ok ? <Report report={result.report} /> : null}
    </main>
  );
}

function Report({ report }: { report: WebAnalyticsReport }) {
  return (
    // Chart text and guides paint with currentColor, and the tooltip reads the
    // --ts-chart-tooltip-* variables, so this wrapper maps both to site tokens.
    <div className="relative mt-8 pt-12 text-fg-tertiary [--ts-chart-tooltip-background:var(--color-bg-default-alt)] [--ts-chart-tooltip-border-radius:0.5rem] [--ts-chart-tooltip-border:1px_solid_var(--color-bg-secondary)] [--ts-chart-tooltip-color:var(--color-fg-default)] sm:mt-12">
      <DashedDivider className="absolute inset-x-0 top-0 mx-auto max-w-[60rem] opacity-40 dark:opacity-20" />

      <div className="space-y-14">
        <Section
          aside={
            <dl className="flex gap-8">
              <StatTile label="Visitors" value={report.totals.visitors} />
              <StatTile label="Page views" value={report.totals.pageviews} />
            </dl>
          }
          caption={`${formatDay(report.since)} – ${formatDay(report.until)}, UTC. Today is still counting.`}
          title="Daily visitors"
        >
          <div className="mt-6">
            <DailyVisitorsChart days={report.daily} />
          </div>
        </Section>

        <ReferrerList entries={report.referrers} />

        <Section title="Countries">
          {report.countries.length > 0 ? (
            <CountryMap
              countries={report.countries}
              totalVisitors={report.totals.visitors}
            />
          ) : (
            <p className="text-sm">No visits yet.</p>
          )}
        </Section>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-sm">{label}</dt>
      <dd className="font-semibold text-2xl text-fg-secondary/90 tracking-tight">
        {formatCount(value)}
      </dd>
    </div>
  );
}

type SectionProps = {
  title: string;
  caption?: string;
  /** Sits opposite the title on one row, and wraps under it on small screens. */
  aside?: ReactNode;
  children: ReactNode;
};

function Section({ title, caption, aside, children }: SectionProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 lg:px-0">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div>
          <h2 className="font-semibold text-fg-secondary/90 text-lg tracking-tight">
            {title}
          </h2>
          {caption ? <p className="mt-1 text-sm">{caption}</p> : null}
        </div>
        {aside}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ReferrerList({ entries }: { entries: readonly ReferrerVisits[] }) {
  if (entries.length === 0) {
    return null;
  }
  return (
    // A dotted lane across the page, like the year tabs on the projects page.
    <div className="relative">
      <DashedDivider className="absolute inset-x-0 top-0 mx-auto max-w-[60rem] opacity-40 dark:opacity-20" />
      <DashedDivider className="absolute inset-x-0 bottom-0 mx-auto max-w-[60rem] opacity-40 dark:opacity-20" />
      {/* The fetcher keeps six sources. They fit one line from md up; below
          that the row scrolls sideways, so it never wraps out of the lane. */}
      <ul className="thin_scrollbar mx-auto flex min-h-10 max-w-3xl items-center gap-x-6 overflow-x-auto whitespace-nowrap px-6 py-1.5 text-fg-default text-sm md:justify-between md:gap-x-4 lg:px-0">
        {entries.map((entry) => {
          const Icon = referrerIcon(entry.source);
          return (
            <li className="flex shrink-0 items-center gap-1" key={entry.label}>
              <Icon aria-hidden className="size-4 shrink-0" />
              <span>{entry.label}</span>
              <span className="ml-1 font-semibold tabular-nums">
                {formatCount(entry.visitors)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
