"use client";

import { getCldImageUrl } from "next-cloudinary";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from "./ui/avatar";

type CloudinaryAvatarProps = {
  src?: string;
  name: string;
  width?: number;
  height?: number;
  crop?: "thumb" | "fill" | "scale" | "fit" | "lfill";
  gravity?: "face" | "faces" | "auto" | "center";
  zoom?: number;
} & AvatarProps;

const CloudinaryAvatar = ({
  src,
  name,
  width,
  height,
  crop,
  gravity,
  zoom,
  ...props
}: CloudinaryAvatarProps) => {
  const avatarUrl = src
    ? getCldImageUrl({
        src,
        width,
        height,
        crop,
        gravity,
        zoom: zoom?.toString(),
      })
    : undefined;

  return (
    <Avatar {...props}>
      <AvatarImage alt={`${name} avatar`} src={avatarUrl} />
      <AvatarFallback className="uppercase">{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

export { CloudinaryAvatar };
