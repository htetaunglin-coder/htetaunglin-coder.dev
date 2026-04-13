import { getCldImageUrl } from "next-cloudinary";
import { cache } from "react";
import { cn } from "@/lib/utils";
import { CloudinaryImage } from "./cloudinary-image";

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

const PageHeroImage = async ({
  alt,
  src,
  className,
  imageClassName,
  imageContainerClassName,
  preload = false,
}: PageHeroImageProps) => {
  const blurDataURL = await getBlurDataUrl(src);

  return (
    <div
      className={cn(
        "-z-1 absolute inset-x-0 top-0 flex h-94 w-full overflow-hidden bg-neutral-800 dark:bg-black",
        className
      )}
    >
      <div className="mx-auto flex h-full w-full max-w-[120rem] justify-end overflow-hidden pr-16">
        <div className={cn("relative h-full w-lg", imageContainerClassName)}>
          <CloudinaryImage
            alt={alt}
            blurDataURL={blurDataURL}
            className={cn("object-cover object-top-right", imageClassName)}
            fill
            placeholder={blurDataURL ? "blur" : "empty"}
            preload={preload}
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={src}
            style={{
              maskImage: "linear-gradient(to left, #000 75%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to left, #000 75%, transparent)",
            }}
          />
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-94 w-full bg-gradient-to-b from-10% from-bg-default/5 to-100% to-bg-default" />
    </div>
  );
};

export { PageHeroImage };
