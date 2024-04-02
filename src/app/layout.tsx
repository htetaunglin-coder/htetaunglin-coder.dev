import type { Metadata } from "next";
import "./css/globals.css";
import "./css/animation.css";
import "./css/fonts.css";
import "./css/util.css";
import Head from "next/head";

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
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body className={"bg-gray-300 dark:bg-flat-black"}>{children}</body>
    </html>
  );
}
