"use client";

import { getCldImageUrl } from "next-cloudinary";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from "./ui/avatar";

const CloudinaryAvatar = ({
  src,
  name,
  width,
  ...props
}: { src?: string; name: string; width?: number } & AvatarProps) => {
  const avatarUrl = src
    ? getCldImageUrl({
        src,
        width,
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
