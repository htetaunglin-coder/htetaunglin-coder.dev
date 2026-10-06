import { hasFlag } from "country-flag-icons";
import * as Flags from "country-flag-icons/react/3x2";
import type { CSSProperties } from "react";
import type { CountryVisits } from "../api/web-analytics";
import { formatCount } from "../lib/format";
import worldMap from "../lib/world-map.json";
import { CountryHover } from "./country-hover";

/** Brand share of each shade, lightest first. Five steps read apart; more blur. */
const SHADE_STEPS = [30, 48, 66, 84, 100] as const;
const LIST_LIMIT = 8;

const MAP: {
  width: number;
  height: number;
  shapes: { code: string; d: string }[];
  /** Small countries, drawn as a dot: too small or absent at this scale. */
  markers: Record<string, number[]>;
} = worldMap;

type CountryMapProps = {
  countries: readonly CountryVisits[];
  /** All visitors in the window, so a share counts every visit, not only the listed countries. */
  totalVisitors: number;
};

export function CountryMap({ countries, totalVisitors }: CountryMapProps) {
  const byCode = new Map(countries.map((country) => [country.code, country]));
  const mostVisitors = countries[0]?.visitors ?? 1;
  const shadeOf = (visitors: number) =>
    shade(
      Math.min(
        SHADE_STEPS.length - 1,
        Math.floor((visitors / mostVisitors) * SHADE_STEPS.length)
      )
    );

  return (
    <CountryHover className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
      {/* Full column height, so the legend ends on the list's last line. */}
      <div className="flex flex-col">
        <svg
          aria-label="World map, countries shaded by visitors"
          className="h-auto w-full"
          role="img"
          viewBox={`0 0 ${MAP.width} ${MAP.height}`}
        >
          {MAP.shapes.map(({ code, d }) => {
            const country = byCode.get(code);
            if (!country) {
              return (
                <path
                  className="fill-bg-secondary stroke-bg-default [stroke-width:0.5]"
                  d={d}
                  key={code}
                />
              );
            }
            return (
              <path
                className="fill-(--shade) stroke-bg-default transition-[fill] duration-300 [stroke-width:0.5] data-active:fill-fg-default"
                d={d}
                data-code={code}
                key={code}
                style={
                  { "--shade": shadeOf(country.visitors) } as CSSProperties
                }
              >
                <title>{countryTitle(country)}</title>
              </path>
            );
          })}
          {countries.map((country) => {
            const marker = MAP.markers[country.code];
            if (!marker) return null;
            const [x, y] = marker;
            return (
              <circle
                className="fill-(--shade) stroke-bg-default [stroke-width:1.5] data-active:fill-fg-default"
                cx={x}
                cy={y}
                data-code={country.code}
                key={country.code}
                r={3.2}
                style={
                  { "--shade": shadeOf(country.visitors) } as CSSProperties
                }
              >
                <title>{countryTitle(country)}</title>
              </circle>
            );
          })}
        </svg>
        <div className="mt-3 flex items-center gap-2 text-xs md:mt-auto">
          Fewer
          <span className="flex gap-0.5">
            {SHADE_STEPS.map((percent, step) => (
              <span
                className="h-2 w-[18px] rounded-xs"
                key={percent}
                style={{ background: shade(step) }}
              />
            ))}
          </span>
          More
        </div>
      </div>

      {/* Rows keep their padding for the hover background; the negative
          margin lines their text up with the column edges. */}
      <div className="-mx-2">
        <div className="flex justify-between px-2 pb-2 text-xs">
          <span>Country</span>
          <span>Visitors</span>
        </div>
        <ol>
          {countries.slice(0, LIST_LIMIT).map((country) => (
            <li
              className="flex items-center gap-3 rounded-md px-2 py-1.5 text-fg-secondary/90 text-sm data-active:bg-fg-brand/10"
              data-code={country.code || undefined}
              key={country.code || country.label}
            >
              <CountryFlag code={country.code} />
              <span className="min-w-0 flex-1 truncate">{country.label}</span>
              <span className="font-semibold tabular-nums">
                {formatCount(country.visitors)}
              </span>
              <span className="w-9 text-right text-fg-tertiary text-xs tabular-nums">
                {totalVisitors > 0
                  ? Math.round((country.visitors / totalVisitors) * 100)
                  : 0}
                %
              </span>
            </li>
          ))}
        </ol>
        {countries.length > LIST_LIMIT ? (
          <p className="mt-2 px-2 text-xs">
            +{countries.length - LIST_LIMIT} more on the map
          </p>
        ) : null}
      </div>
    </CountryHover>
  );
}

function CountryFlag({ code }: { code: string }) {
  if (!hasFlag(code)) {
    return (
      <span
        aria-hidden
        className="h-3 w-[18px] shrink-0 rounded-xs bg-bg-secondary"
      />
    );
  }
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: server component; no flag reaches the browser bundle.
  const Flag = Flags[code as keyof typeof Flags];
  return (
    <Flag
      aria-hidden
      className="h-3 w-[18px] shrink-0 rounded-xs brightness-95 dark:brightness-100"
    />
  );
}

function shade(step: number) {
  return `color-mix(in oklab, var(--color-fg-brand) ${SHADE_STEPS[step]}%, var(--color-bg-secondary))`;
}

function countryTitle({ label, visitors }: CountryVisits) {
  return `${label}: ${formatCount(visitors)} ${visitors === 1 ? "visitor" : "visitors"}`;
}
