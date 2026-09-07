"use client";

import ImageUploadCard, {
  type ImageValueType,
} from "@/components/media/ImageUploadCard";

type MultiImageUploaderPropsType = {
  folder: string;
  bannerImage: ImageValueType | null;
  galleryImages: ImageValueType[];
  onBannerChange: (image: ImageValueType | null) => void;
  onGalleryChange: (images: ImageValueType[]) => void;
  maxGallery?: number;
  bannerError?: string;
  galleryError?: string;
};

const MultiImageUploader = ({
  folder,
  bannerImage,
  galleryImages,
  onBannerChange,
  onGalleryChange,
  maxGallery = 9,
  bannerError,
  galleryError,
}: MultiImageUploaderPropsType) => {
  const canAddMoreGallery = galleryImages.length < maxGallery;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-2">
          Banner Image <span className="text-red-500">*</span>
        </p>
        <ImageUploadCard
          value={bannerImage}
          onChange={onBannerChange}
          folder={folder}
          label="Banner Image"
          required
        />
        {bannerError && (
          <p className="text-red-500 text-[12px] mt-1">{bannerError}</p>
        )}
      </div>

      <div>
        <p className="text-[11px] tracking-[0.18em] uppercase text-charcoal font-semibold mb-2">
          Gallery Images ({galleryImages.length}/{maxGallery})
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {galleryImages.map((image, index) => (
            <ImageUploadCard
              key={`${image.url}-${index}`}
              value={image}
              folder={folder}
              label={`Gallery Image ${index + 1}`}
              size="sm"
              onChange={(next) => {
                if (!next) {
                  onGalleryChange(
                    galleryImages.filter((_, i) => i !== index),
                  );
                  return;
                }
                onGalleryChange(
                  galleryImages.map((img, i) => (i === index ? next : img)),
                );
              }}
            />
          ))}

          {canAddMoreGallery && (
            <ImageUploadCard
              key={`add-slot-${galleryImages.length}`}
              value={null}
              folder={folder}
              label="Add Image"
              size="sm"
              onChange={(next) => {
                if (!next) return;
                onGalleryChange([...galleryImages, next]);
              }}
            />
          )}
        </div>
        {galleryError && (
          <p className="text-red-500 text-[12px] mt-1">{galleryError}</p>
        )}
      </div>
    </div>
  );
};

export default MultiImageUploader;
