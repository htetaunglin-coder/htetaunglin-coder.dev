"use client";

import { CldImage, type CldImageProps } from "next-cloudinary";

const CloudinaryImage = (props: CldImageProps) => <CldImage {...props} />;

export { CloudinaryImage };
