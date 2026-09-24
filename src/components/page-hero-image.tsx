import { getCldImageUrl } from "next-cloudinary";
import { cache } from "react";
import { cn } from "@/lib/utils";
import { CloudinaryImage } from "./cloudinary-image";

// Radial keeps the subject; the two linear layers guarantee the bottom and
// right box edges reach full transparency, so a tall or wide image never
// shows a rectangular cut.
const IMAGE_MASK = [
  "radial-gradient(120% 100% at 80% 30%, #000 45%, transparent 80%)",
  "linear-gradient(to top, transparent, #000 20%)",
  "linear-gradient(to left, transparent, #000 25%)",
].join(", ");

type PageHeroImageProps = {
  alt: string;
  src: string;
  className?: string;
  imageClassName?: string;
  imageContainerClassName?: string;
  preload?: boolean;
};

const getBlurDataUrl = cache(async (src: string) => {
  try {
    const imageUrl = getCldImageUrl({
      src,
      width: 64,
    });
    const response = await fetch(imageUrl, { cache: "force-cache" });

    if (!response.ok) return undefined;

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return `data:${contentType};base64,${base64}`;
  } catch {
    return undefined;
  }
});

export async function PageHeroImage({
  alt,
  src,
  className,
  imageClassName,
  imageContainerClassName,
  preload = false,
}: PageHeroImageProps) {
  const blurDataURL = await getBlurDataUrl(src);

  return (
    <div
      className={cn(
        "-z-1 absolute inset-x-0 top-0 h-94 w-full overflow-hidden bg-neutral-300 md:bg-neutral-800 dark:bg-black",
        className
      )}
    >
      <div className="relative mx-auto h-full max-w-4xl">
        <div
          className={cn(
            "absolute inset-y-0 right-0 hidden w-sm md:block lg:w-lg",
            imageContainerClassName
          )}
        >
          <CloudinaryImage
            alt={alt}
            blurDataURL={blurDataURL}
            className={cn("object-contain object-top-right", imageClassName)}
            fill
            placeholder={blurDataURL ? "blur" : "empty"}
            preload={preload}
            sizes="(max-width: 1024px) 384px, 512px"
            src={src}
            style={{
              maskImage: IMAGE_MASK,
              maskComposite: "intersect",
              WebkitMaskImage: IMAGE_MASK,
              WebkitMaskComposite: "source-in",
            }}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-94 w-full bg-gradient-to-b from-10% from-bg-default/5 to-100% to-bg-default" />
    </div>
  );
}
