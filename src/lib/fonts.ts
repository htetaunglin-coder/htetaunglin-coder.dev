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

// Not in `fonts` above, which the root layout puts on `<body>`: this one is
// applied per-subtree, by the `/my` layout and by `LanguageSwitch` wherever a
// Burmese label appears on an English route.
export const myanmarFont = fontNotoSansMyanmar.variable;
