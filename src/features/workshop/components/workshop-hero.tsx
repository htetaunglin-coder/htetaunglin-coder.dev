import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const IMAGE_WIDTH_PX = 1040;

type WorkshopHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  imageContainerClassName?: string;
};

export function WorkshopHero({
  eyebrow,
  title,
  description,
  image,
  imageContainerClassName,
}: WorkshopHeroProps) {
  return (
    <>
      <div className="-z-1 absolute inset-x-0 top-0 h-110 w-full overflow-hidden bg-neutral-300 md:bg-neutral-800 dark:bg-black">
        <div className="relative mx-auto h-full max-w-5xl">
          {/* Offset the photo from the centered track, not the viewport. A
              viewport anchor moves the photo away from the title as the window
              grows. */}
          <div
            className={cn(
              "-right-68 absolute inset-y-0 hidden w-(--image-width) opacity-85 md:block",
              imageContainerClassName
            )}
            style={{ "--image-width": `${IMAGE_WIDTH_PX}px` } as CSSProperties}
          >
            <Image
              alt={image.alt}
              className="object-cover object-right"
              fill
              preload
              sizes={`${IMAGE_WIDTH_PX}px`}
              src={image.src}
              style={{
                maskImage:
                  "radial-gradient(72% 62% at 52% 50%, #000 20%, transparent 72%)",
                WebkitMaskImage:
                  "radial-gradient(72% 62% at 52% 50%, #000 20%, transparent 72%)",
              }}
            />
          </div>
        </div>

        {/* Light mode and mobile use the overlay from page-hero-image.tsx, so
            the workshop matches the index pages. The dark wash from the left
            and the bottom exists for the photo, which mobile hides. */}
        <div className="absolute inset-0 bg-gradient-to-b from-10% from-bg-default/5 to-100% to-bg-default md:dark:hidden" />

        <div className="absolute inset-0 hidden bg-[linear-gradient(to_bottom,transparent_35%,var(--color-bg-default)_100%),linear-gradient(to_right,var(--color-bg-default)_22%,transparent_58%)] md:dark:block" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pt-4 font-inter md:pt-52 lg:px-0">
        <p className="font-mono text-fg-tertiary/80 text-xs uppercase tracking-[0.08em]">
          {eyebrow}
        </p>

        <h1 className="mt-3 bg-gradient-to-br from-black to-fg-tertiary bg-clip-text font-bold font-inter text-3xl/[1.2] text-transparent tracking-tight sm:text-4xl/[1.2] md:font-extrabold md:text-5xl/[1.2] dark:from-fg-default dark:to-fg-tertiary/80">
          {title}
        </h1>

        <p className="mt-2 max-w-xl font-medium text-base text-neutral-900/80 tracking-tight sm:text-lg/normal dark:text-fg-tertiary">
          {description}
        </p>
      </div>
    </>
  );
}
