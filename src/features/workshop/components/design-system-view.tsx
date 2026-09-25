import { DESIGN_SYSTEM_PAGE } from "@/constants/navigation";
import { WorkshopPage } from "./workshop-page";

const MESSAGE =
  "You're actually looking at it right now, it runs this whole site. Writing it all down is the part I keep skipping, so I made this page to push myself :3";

export function DesignSystemView({ description }: { description: string }) {
  return (
    <WorkshopPage
      description={description}
      eyebrow="Workshop / 02"
      imageContainerClassName="right-20"
      page={DESIGN_SYSTEM_PAGE}
    >
      <p className="pt-8 pb-12 text-base/relaxed text-fg-tertiary/80">
        {MESSAGE}
      </p>
    </WorkshopPage>
  );
}
