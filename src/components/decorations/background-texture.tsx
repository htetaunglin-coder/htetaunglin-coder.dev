import type React from "react";

import { cn } from "@/lib/utils";

export type TextureVariant = "fabric-of-squares" | "groovepaper" | "none";

type BackgroundImageTextureProps = {
  variant?: TextureVariant;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
};

const textureMap: Record<Exclude<TextureVariant, "none">, string> = {
  "fabric-of-squares": "/images/textures/fabric-of-squares.png",
  groovepaper: "/images/textures/groovepaper.png",
};

export function BackgroundImageTexture({
  variant = "fabric-of-squares",
  opacity = 0.5,
  className,
  children,
}: BackgroundImageTextureProps) {
  const textureUrl = variant !== "none" ? textureMap[variant] : null;

  return (
    <div className={cn("relative", className)}>
      {textureUrl && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${textureUrl})`,
            backgroundRepeat: "repeat",
            opacity,
          }}
        />
      )}
      {children && <div className="relative">{children}</div>}
    </div>
  );
}
