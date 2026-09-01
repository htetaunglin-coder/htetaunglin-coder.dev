import type { Metadata } from "next";
import { DESIGN_SYSTEM_SKETCH } from "@/components/decorations/workshop-sketch-art";
import { WorkshopView } from "@/features/workshop/components/workshop-view";
import { absoluteUrl } from "@/lib/utils";

const DESCRIPTION =
  "The design system running this site, not a general-purpose library. Rules, spacing, components and patterns — take what you need. Each section gets its full write-up as I go.";

export const metadata: Metadata = {
  title: "Design System",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/design-system") },
  openGraph: {
    title: "Design System | Htet Aung Lin",
    description: DESCRIPTION,
    url: absoluteUrl("/design-system"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Design System | Htet Aung Lin",
    description: DESCRIPTION,
  },
};

const MESSAGE =
  "You're actually looking at it right now, it runs this whole site. Writing it all down is the part I keep skipping, so I made this page to push myself :3";

export default function DesignSystemPage() {
  return (
    <WorkshopView
      layers={DESIGN_SYSTEM_SKETCH}
      message={MESSAGE}
      title="Design System"
    />
  );
}
