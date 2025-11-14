"use client";

import { Camera, Download, Loader2 } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { getCldImageUrl } from "next-cloudinary";

export type ImageViewerProps = {
  images: {
    id: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
};

const ImageViewer = ({ images }: ImageViewerProps) => {
  const maxVisible = 4;
  const remainingCount = images.length - maxVisible;
  const hasMoreImages = remainingCount > 0;

  return (
    <PhotoProvider
      brokenElement={
        <div className="group w-full transition-colors">
          <div className="flex flex-col items-center space-y-3 p-4 text-center">
            <div className="rounded-full bg-gray-200 p-3 transition-colors group-hover:bg-gray-300">
              <Camera className="size-6 text-gray-500" />
            </div>

            <div className="space-y-2">
              <p className="font-medium text-neutral-100">
                Image not available
              </p>
              <p className="max-w-xs text-neutral-300 text-xs">
                The image could not be loaded. This might be due to network
                issues or the file being moved.
              </p>
            </div>
          </div>
        </div>
      }
      loadingElement={<Loader2 className="animate-spin" size={40} />}
      loop={false}
      maskClosable
      maskOpacity={0.9}
      photoClosable
      pullClosable
      speed={() => 300}
      toolbarRender={({ index }) => {
        const currentImage = images[index];

        return (
          <button
            className="PhotoView-Slider__toolbarIcon"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (currentImage) {
                try {
                  const response = await fetch(currentImage.src);
                  const blob = await response.blob();

                  const url = window.URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.style.display = "none";
                  link.href = url;
                  link.download = currentImage.alt || "image";

                  link.target = "_blank";
                  link.rel = "noopener noreferrer";

                  document.body.appendChild(link);
                  link.click();

                  setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  }, 100);
                } catch (error) {
                  console.error("Download failed:", error);
                  // Fallback: open in new tab
                  window.open(currentImage.src, "_blank");
                }
              }
            }}
            title="Download image"
            type="button"
          >
            <Download size={22} />
          </button>
        );
      }}
    >
      <style>
        {`
        .PhotoView-Slider__BannerWrap {
          padding: 1rem 2rem;
          height: 48px;
        }
       
        .PhotoView-Slider__ArrowLeft svg,
        .PhotoView-Slider__ArrowRight svg {
          border-radius: 999px;
        }
      `}
      </style>
      <div className="not-prose grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((image, index) => {
          const isLastVisible = index === maxVisible - 1;
          const shouldShowOverlay = hasMoreImages && isLastVisible;
          const isHidden = index >= maxVisible;

          const imageUrl = getCldImageUrl({
            src: image.src,
            width: image.width,
            height: image.height,
          });

          return (
            <div
              className={`relative aspect-[1/1.1] overflow-hidden rounded-lg bg-bg-tertiary ${isHidden ? "hidden" : ""}`}
              key={image.id}
            >
              <PhotoView
                height={image.height}
                src={imageUrl}
                width={image.width}
              >
                <div className="group/image-viewer z-10 size-full cursor-pointer">
                  {/* biome-ignore lint/correctness/useImageSize: off*/}
                  {/* biome-ignore lint/performance/noImgElement: off*/}
                  {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: off*/}
                  <img
                    alt={image.alt}
                    className="pointer-events-none size-full object-cover object-center transition-transform group-hover/image-viewer:scale-105"
                    draggable={false}
                    loading={index === 0 ? "eager" : "lazy"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,${encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                          <rect width="400" height="300" fill="#f3f4f6"/>
                          <text x="200" y="150" text-anchor="middle" dy="0.3em" font-family="sans-serif" font-size="14" fill="#9ca3af">
                            Image failed to load
                          </text>
                        </svg>
                      `)}`;
                    }}
                    src={imageUrl}
                    title={image.alt}
                  />

                  {shouldShowOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <div className="text-center text-white">
                        <div className="mb-1 font-bold text-2xl">
                          +{remainingCount}
                        </div>
                        <div className="text-sm opacity-90">more</div>
                      </div>
                    </div>
                  )}

                  {!(shouldShowOverlay || isHidden) && (
                    <div className="pointer-events-none absolute inset-0 flex items-end justify-start bg-black/0 p-3 opacity-0 transition-colors group-hover/image-viewer:bg-black/10 group-hover/image-viewer:opacity-100">
                      <span className="rounded bg-black/50 px-1.5 py-0.5 text-white text-xs backdrop-blur-sm">
                        {index + 1} / {images.length}
                      </span>
                    </div>
                  )}
                </div>
              </PhotoView>
            </div>
          );
        })}
      </div>

      <style global jsx>{`
        .react-photo-view-backdrop {
          backdrop-filter: blur(8px);
        }

        /* Custom scrollbar for info panel */
        .react-photo-view-backdrop *::-webkit-scrollbar {
          width: 6px;
        }

        .react-photo-view-backdrop *::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .react-photo-view-backdrop *::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .react-photo-view-backdrop *::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </PhotoProvider>
  );
};

export { ImageViewer };
