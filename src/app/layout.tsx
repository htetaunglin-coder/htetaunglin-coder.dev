import "@/styles/globals.css";

import { MotionConfig } from "motion/react";
import type { Metadata } from "next";
import GrainyOverlay from "@/components/decorations/grainy-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fonts } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl, cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url as string),
  title: {
    default: siteConfig.title,
    template: `${siteConfig.title} | %s`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
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
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  keywords: siteConfig.keywords,
};

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => (
  <html lang="en" suppressHydrationWarning>
    <body className={cn("min-h-screen font-sans", fonts)}>
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

export default RootLayout;
