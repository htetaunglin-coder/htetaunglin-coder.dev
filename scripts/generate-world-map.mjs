// Builds src/features/analytics/lib/world-map.json for the analytics country
// map. Run `pnpm map:generate` only when the map itself should change; the page
// build reads the committed file and never needs the network.
import { writeFileSync } from "node:fs";
import { geoArea, geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";

// Pinned release, so a rerun gives the same shapes.
const SOURCE =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson";
const OUTPUT = new URL(
  "../src/features/analytics/lib/world-map.json",
  import.meta.url
);
const WIDTH = 480;
const HEIGHT = 250;
/** Antarctica has no visitors and would take a fifth of the frame. */
const SKIPPED = new Set(["AQ"]);
/** Shapes smaller than this, in square map units, also get a marker. */
const MARKER_AREA = 18;
const LEADING_MOVE = /^M/;

const [shapeSource, markerSource] = await Promise.all([
  fetchCountries("110m"),
  fetchCountries("50m"),
]);
const projection = geoNaturalEarth1().fitExtent(
  [
    [2, 2],
    [WIDTH - 2, HEIGHT - 2],
  ],
  { type: "FeatureCollection", features: shapeSource }
);
const path = geoPath(projection).digits(0);

const shapes = [];
const shapeAreas = new Map();
for (const feature of shapeSource) {
  const d = compact(path(feature) ?? "");
  if (!d) continue;
  shapes.push({ code: feature.properties.ISO_A2_EH, d });
  shapeAreas.set(feature.properties.ISO_A2_EH, path.area(feature));
}

// The 110m shapes drop small countries such as Singapore and Hong Kong. The
// 50m data still has them, so they get a marker at their largest polygon.
const markers = {};
for (const feature of markerSource) {
  const code = feature.properties.ISO_A2_EH;
  if ((shapeAreas.get(code) ?? 0) >= MARKER_AREA) continue;
  const [x, y] = projection(geoCentroid(largestPolygon(feature)));
  markers[code] = [Math.round(x), Math.round(y)];
}

writeFileSync(
  OUTPUT,
  `${JSON.stringify({ width: WIDTH, height: HEIGHT, shapes, markers })}\n`
);
console.log(
  `Wrote ${shapes.length} shapes and ${Object.keys(markers).length} markers to ${OUTPUT.pathname}`
);

async function fetchCountries(scale) {
  const res = await fetch(`${SOURCE}/ne_${scale}_admin_0_countries.geojson`);
  if (!res.ok) {
    throw new Error(`Natural Earth ${scale} returned ${res.status}`);
  }
  const collection = await res.json();
  // "-99" marks areas with no ISO code (Somaliland, Northern Cyprus).
  return collection.features.filter(
    ({ properties: { ISO_A2_EH: code } }) =>
      code !== "-99" && !SKIPPED.has(code)
  );
}

function largestPolygon(feature) {
  const { geometry } = feature;
  if (geometry.type === "Polygon") return geometry;
  let largest = null;
  for (const coordinates of geometry.coordinates) {
    const polygon = { type: "Polygon", coordinates };
    if (!largest || geoArea(polygon) > geoArea(largest)) largest = polygon;
  }
  return largest;
}

// Whole-pixel rounding leaves runs of the same point. Dropping them halves the
// file, and a ring that collapses below three points is not drawn at all.
function compact(d) {
  return d
    .split("Z")
    .map((ring) => {
      const points = [];
      for (const point of ring.replace(LEADING_MOVE, "").split("L")) {
        if (point && points.at(-1) !== point) points.push(point);
      }
      return points.length >= 3 ? `M${points.join("L")}Z` : "";
    })
    .join("");
}
