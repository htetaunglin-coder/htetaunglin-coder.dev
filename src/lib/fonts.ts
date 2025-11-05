import { Doto, Inter, JetBrains_Mono } from "next/font/google";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  fallback: ["system-ui", "arial"],
});

const doto = Doto({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-doto",
});

export const fonts = [fontSans.variable, fontMono.variable, doto.variable];
