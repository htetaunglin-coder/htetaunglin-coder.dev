import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  url: {
    analytics: false,
  },
});

type getCloudinaryImageUrlType = {
  publicId: string;
  width?: number;
  aspect?: { width: number; height: number };
};

export function getCloudinaryImageUrl({
  publicId,
  width,
  aspect,
}: getCloudinaryImageUrlType) {
  const main = cld.image(publicId);

  if (aspect) {
    main.addTransformation(
      `c_fill,ar_${aspect.width}:${aspect.height},w_${width}`
    );
  }

  const url = main.format("auto").quality("auto").toURL();

  const blur = cld.image(publicId);

  if (aspect) {
    blur.addTransformation(
      `c_fill,ar_${aspect.width}:${aspect.height},w_${width}`
    );
  }
  const urlBlurred = blur.addTransformation("e_blur:1000").quality(1).toURL();

  return { url, urlBlurred };
}
