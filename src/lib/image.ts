import type { ImageFormDataType } from "@/schema/image";

/**
 * Combines a required banner image and an optional gallery array into one
 * flat, ordered list for persistence — banner first (isPrimary, sortOrder 0),
 * gallery images follow in order (sortOrder 1..n).
 */
export const flattenBannerGallery = (
  bannerImage: ImageFormDataType,
  galleryImages: ImageFormDataType[],
) => {
  return [
    { ...bannerImage, isPrimary: true, sortOrder: 0 },
    ...galleryImages.map((image, index) => ({
      ...image,
      isPrimary: false,
      sortOrder: index + 1,
    })),
  ];
};
