import type { Metadata } from "next";
import "./css/globals.css";
import "./css/animation.css";
import "./css/fonts.css";
import "./css/util.css";

// ======================================================================

export const metadata: Metadata = {
  title: "Htet Aung Lin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"bg-gray-300 dark:bg-flat-black"}>{children}</body>
    </html>
  );
}
