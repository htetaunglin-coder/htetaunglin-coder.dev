"use client";

import { areaY, crosshair, defineChart, lineY } from "@tanstack/charts";
import { motion } from "@tanstack/charts/motion";
import { Chart as RendererChart } from "@tanstack/charts/react/core";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { useMemo } from "react";
import { DASH_PATTERN } from "@/components/decorations/dashed-divider";
import { DURATION } from "@/lib/motion";
import type { DailyVisits } from "../api/web-analytics";
import { formatCount, formatDay } from "../lib/format";

/** Paint for data marks. Labels and values stay on text tokens. */
const BRAND = "var(--color-fg-brand)";

const VISITORS_FILL_ID = "daily-visitors-fill";

// The cursor, dot, and tooltip glide like the rest of the site. The renderer
// snaps instead when the reader asks for reduced motion.
const hoverGlide = motion({
  transition: {
    type: "tween",
    duration: DURATION.fast * 1000,
    easing: easeOutExpo,
  },
});

type DailyVisitorsChartProps = { days: readonly DailyVisits[] };

export function DailyVisitorsChart({ days }: DailyVisitorsChartProps) {
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          crosshair({ x: { strokeWidth: 2 }, y: false }),
          areaY(days, {
            x: "date",
            y: "visitors",
            fill: `url(#${VISITORS_FILL_ID})`,
            fillOpacity: 1,
          }),
          lineY(days, {
            x: "date",
            y: "visitors",
            stroke: BRAND,
            strokeWidth: 2.25,
          }),
        ],
        scales: {
          x: {
            scale: scalePoint,
            axis: {
              line: false,
              ticks: { format: formatDay, size: 0 },
              tickLabels: { thin: { priority: "ends" } },
            },
          },
          // The tooltip carries exact counts, so the y axis labels stay off, as
          // in the area-chart design this follows. Grid lines still show scale.
          y: {
            scale: scaleLinear,
            nice: true,
            grid: {
              stroke: "var(--grid-dot-color)",
              strokeDasharray: DASH_PATTERN,
              strokeOpacity: 1,
              lineCap: "butt",
            },
            axis: false,
          },
        },
        gradients: [
          {
            id: VISITORS_FILL_ID,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
            stops: [
              { offset: 0, color: BRAND, opacity: 0.32 },
              { offset: 1, color: BRAND, opacity: 0 },
            ],
          },
        ],
        // Snap to the nearest day anywhere over the plot, not only near the line.
        focus: "nearest-x",
        maxFocusDistance: Number.POSITIVE_INFINITY,
        focusRing: { radius: 6, fill: BRAND, stroke: "white", strokeWidth: 2 },
        tooltip: {
          use: tooltip,
          placement: ["right", "left"],
          offset: 12,
          content: ([point]) => ({
            title: point ? formatDay(point.datum.date) : "",
            rows: point
              ? [
                  {
                    label: "Visitors",
                    value: formatCount(point.datum.visitors),
                    color: BRAND,
                  },
                  {
                    label: "Page views",
                    value: formatCount(point.datum.pageviews),
                  },
                ]
              : [],
          }),
        },
      }),
    [days]
  );

  return (
    <RendererChart
      ariaLabel={`Daily visitors over the last ${days.length} days`}
      // strokeOpacity is one number for both themes, so the grid color carries
      // the opacity. Dark mode needs quieter dots.
      className="[--grid-dot-color:color-mix(in_oklab,currentColor_50%,transparent)] dark:[--grid-dot-color:color-mix(in_oklab,currentColor_25%,transparent)]"
      definition={definition}
      height={240}
      initialWidth={720}
      renderer={hoverGlide}
    />
  );
}

// The same curve as EASE.out in src/lib/motion.ts: fast start, long glide.
function easeOutExpo(progress: number) {
  return progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
}
