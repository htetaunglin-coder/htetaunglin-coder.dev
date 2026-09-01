import { ArrowLeft } from "lucide-react";
import { FadeAnimation } from "@/components/animations/fade-animation";
import {
  type Placement,
  SketchDrawing,
} from "@/components/decorations/workshop-illustrations";
import type { SketchLayer } from "@/components/decorations/workshop-sketch-art";
import { GoBackButton } from "@/components/ui/go-back-button";

/* The art is bottom-weighted, so centring its viewBox would leave it low. */
const CENTRED: Placement = {
  fadeCentre: "50% 60%",
  offsetX: 0,
  offsetY: -22,
};

/* No card behind the drawing, so its fills have to match the page itself. */
const PAGE_SURFACE = "var(--color-bg-default)";

export const WorkshopView = ({
  title,
  message,
  layers,
}: {
  title: string;
  message: string;
  layers: SketchLayer[];
}) => (
  <main className="pt-16 pb-24 font-inter sm:pt-24">
    <div className="mx-auto max-w-4xl px-6 lg:px-0">
      <GoBackButton className="flex cursor-pointer items-center gap-1.5 font-medium text-base text-fg-tertiary hover:text-fg-accent hover:underline">
        <ArrowLeft />
        Go Back
      </GoBackButton>

      <FadeAnimation
        as="div"
        className="flex flex-col items-center text-center"
        direction="up"
      >
        <div className="relative h-72 w-full max-w-lg sm:h-80">
          <SketchDrawing
            className="pointer-events-none absolute inset-0 h-full w-full opacity-70 dark:opacity-60"
            fit="contain"
            layers={layers}
            placement={CENTRED}
            surface={PAGE_SURFACE}
          />
        </div>

        <h1 className="mt-8 font-medium text-fg-default text-xl tracking-tight sm:text-2xl">
          {title}
        </h1>

        <p className="mt-3 max-w-md text-base/relaxed text-fg-tertiary/80">
          {message}
        </p>
      </FadeAnimation>
    </div>
  </main>
);
