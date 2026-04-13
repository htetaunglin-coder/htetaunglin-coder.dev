import { Doto, Gloria_Hallelujah, Inter } from "next/font/google";

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

export const fonts = [
  fontInter.variable,
  fontGloriaHallelujah.variable,
  doto.variable,
];
