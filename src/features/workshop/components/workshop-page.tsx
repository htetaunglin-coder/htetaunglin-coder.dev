import type { ReactNode } from "react";
import type { WorkshopItem } from "@/constants/navigation";
import { WorkshopHero } from "./workshop-hero";

type WorkshopPageProps = {
  page: WorkshopItem;
  eyebrow: string;
  description: string;
  imageContainerClassName?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function WorkshopPage({
  page,
  eyebrow,
  description,
  imageContainerClassName,
  actions,
  children,
}: WorkshopPageProps) {
  return (
    <>
      <WorkshopHero
        actions={actions}
        description={description}
        eyebrow={eyebrow}
        image={page.image}
        imageContainerClassName={imageContainerClassName}
        title={page.title}
      />

      <main className="relative mx-auto max-w-4xl pb-16">
        <div className="relative px-6 font-inter lg:px-0">{children}</div>
      </main>
    </>
  );
}
