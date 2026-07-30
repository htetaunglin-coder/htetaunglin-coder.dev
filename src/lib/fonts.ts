import {
  Doto,
  Gloria_Hallelujah,
  Inter,
  Noto_Sans_Myanmar,
} from "next/font/google";

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
});

const fontGloriaHallelujah = Gloria_Hallelujah({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-gloria-hallelujah",
  fallback: ["system-ui", "arial"],
  preload: false,
});

const doto = Doto({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-doto",
  preload: false,
});

const fontNotoSansMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-sans-myanmar",
  preload: false,
  // Padauk and Myanmar Text are the Myanmar faces most likely to be installed
  // already; `sans-serif` last so Latin sitting inside Burmese text (a URL, a
  // product name) still lands on a real font — this subset carries no Latin.
  fallback: ["Padauk", "Myanmar Text", "sans-serif"],
});

export const fonts = [
  fontInter.variable,
  fontGloriaHallelujah.variable,
  doto.variable,
];

// Deliberately not in `fonts` above: that array goes on `<body>` in the root
// layout, whereas this is applied by the Burmese blog layout alone. No element
// outside `/my` ever matches the family, so the woff2 files are never fetched
// for an English reader — `preload: false` keeps that true.
//
// The `@font-face` rules themselves (~3 KB raw) do still ship in the global CSS
// chunk, because the root layout imports this file. Moving this declaration to
// its own module confines them to `/my`; measured and chosen against on purpose,
// in favour of keeping one fonts file.
export const myanmarFont = fontNotoSansMyanmar.variable;
