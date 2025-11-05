import "@/styles/globals.css";

import type { Metadata } from "next";

import GrainyOverlay from "@/components/decorations/grainy-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { fonts } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url as string),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: "/opengraph-image.jpg",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: "/opengraph-image.jpg",
  },
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
          {children}
          {/* <Footer /> */}
          <GrainyOverlay />
        </TooltipProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
