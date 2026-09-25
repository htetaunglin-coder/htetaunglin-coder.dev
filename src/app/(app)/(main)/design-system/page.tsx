import type { Metadata } from "next";
import { DESIGN_SYSTEM_PAGE } from "@/constants/navigation";
import { DesignSystemView } from "@/features/workshop/components/design-system-view";
import { absoluteUrl } from "@/lib/utils";

const PAGE_URL = absoluteUrl(DESIGN_SYSTEM_PAGE.href);

const DESCRIPTION =
  "The design system running this site, not a general-purpose library. Rules, spacing, components and patterns.";

export const metadata: Metadata = {
  title: DESIGN_SYSTEM_PAGE.title,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${DESIGN_SYSTEM_PAGE.title} | Htet Aung Lin`,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${DESIGN_SYSTEM_PAGE.title} | Htet Aung Lin`,
    description: DESCRIPTION,
  },
};

export default function DesignSystemPage() {
  return <DesignSystemView description={DESCRIPTION} />;
}
