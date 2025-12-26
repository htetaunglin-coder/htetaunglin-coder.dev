import "@/styles/globals.css";

import { MotionConfig } from "motion/react";
import type { Metadata, Viewport } from "next";
import GrainyOverlay from "@/components/decorations/grainy-overlay";
import { StructuredData } from "@/components/structured-data";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fonts } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import {
  getPersonStructuredData,
  getWebSiteStructuredData,
} from "@/lib/structured-data";
import { absoluteUrl, cn } from "@/lib/utils";

export const metadata: Metadata = {
  creator: "Htet Aung Lin (Kelvin)",
  authors: [{ name: "Htet Aung Lin", url: siteConfig.url as string }],
  metadataBase: new URL(siteConfig.url as string),
  title: {
    default: siteConfig.title,
    template: `${siteConfig.title} | %s`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: { index: true, follow: true },
  alternates: {
    canonical: absoluteUrl("/"),
  },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  openGraph: {
    url: absoluteUrl("/"),
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@htetaunglin_cdr",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  verification: {
    google: siteConfig.googleSiteVerificationId,
  },
  category: "technology",
  applicationName: siteConfig.name,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const personStructuredData = getPersonStructuredData();
  const websiteStructuredData = getWebSiteStructuredData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans", fonts)}>
        <StructuredData data={personStructuredData} />
        <StructuredData data={websiteStructuredData} />
        <ThemeProvider attribute="class">
          <TooltipProvider
            delayDuration={200}
            disableHoverableContent={false}
            skipDelayDuration={0}
          >
            <Toaster expand={true} />
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
            <GrainyOverlay />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
