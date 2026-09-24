import type { Metadata } from "next";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import { DESIGN_SYSTEM_PAGE } from "@/constants/navigation";
import { WorkshopHero } from "@/features/workshop/components/workshop-hero";
import { absoluteUrl } from "@/lib/utils";

const PAGE_URL = absoluteUrl(DESIGN_SYSTEM_PAGE.href);

const DESCRIPTION =
  "The design system running this site, not a general-purpose library. Rules, spacing, components and patterns.";

export const metadata: Metadata = {
  title: "Design System",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Design System | Htet Aung Lin",
    description: DESCRIPTION,
    url: PAGE_URL,
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
    <>
      <WorkshopHero
        description={DESCRIPTION}
        eyebrow="Workshop / 02"
        image={DESIGN_SYSTEM_PAGE.image}
        imageContainerClassName="right-20"
        title={DESIGN_SYSTEM_PAGE.title}
      />

      <main className="relative mx-auto mt-8 max-w-4xl pb-8">
        <DashedDivider className="inset-x-0 opacity-40 lg:mx-[-3.5rem] dark:opacity-20" />

        <div className="relative px-6 font-inter lg:px-0">
          <p className="pt-8 pb-12 text-base/relaxed text-fg-tertiary/80">
            {MESSAGE}
          </p>
        </div>
      </main>
    </>
  );
}
