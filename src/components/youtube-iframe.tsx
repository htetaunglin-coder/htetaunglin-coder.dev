import type React from "react";
import { cn } from "@/lib/utils";

const YoutubeIframe = ({
  src,
  className,
  title,
  ...props
}: React.ComponentProps<"iframe"> & { src: string }) => {
  const videoId = extractVideoId(src);

  return (
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className={cn(
        "mt-2 mb-8 aspect-video size-full max-w-3xl rounded-md border-0 bg-bg-tertiary outline-none"
      )}
      referrerPolicy="strict-origin-when-cross-origin"
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title || "YouTube video player"}
      {...props}
    />
  );
};

export { YoutubeIframe };

const URL_PATTERNS = [
  /https?:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)(?:[&?][^&?]*)*$/,
  /https?:\/\/(?:www\.youtube\.com\/embed\/)([0-9A-Za-z_-]+)(?:[&?][^&?]*)*$/,
];

/**
 * Extract YouTube video ID from a URL string
 */
const extractVideoId = (text: string): string | null => {
  for (const pattern of URL_PATTERNS) {
    const match = text.match(pattern);
    const result = match?.[1];
    if (result) return result;
  }
  return null;
};
