import type { ReactNode } from "react";
import { DashedDivider } from "@/components/decorations/dashed-divider";
import type { WorkshopItem } from "@/constants/navigation";
import { WorkshopHero } from "./workshop-hero";

type WorkshopPageProps = {
  page: WorkshopItem;
  eyebrow: string;
  description: string;
  imageContainerClassName?: string;
  children: ReactNode;
};

/** The hero and the divided column that every workshop page opens with. */
export function WorkshopPage({
  page,
  eyebrow,
  description,
  imageContainerClassName,
  children,
}: WorkshopPageProps) {
  return (
    <>
      <WorkshopHero
        description={description}
        eyebrow={eyebrow}
        image={page.image}
        imageContainerClassName={imageContainerClassName}
        title={page.title}
      />

      <main className="relative mx-auto mt-8 max-w-4xl pb-8">
        <DashedDivider className="lg:-mx-14 opacity-40 dark:opacity-20" />

        <div className="relative px-6 font-inter lg:px-0">{children}</div>
      </main>
    </>
  );
}
