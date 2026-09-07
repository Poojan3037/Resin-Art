"use client";

import ImageUploader from "@/components/media/ImageUploader";
import { toast } from "sonner";

export type ImageValueType = {
  url: string;
  altText?: string;
};

type ImageUploadCardPropsType = {
  value: ImageValueType | null;
  onChange: (image: ImageValueType | null) => void;
  folder: string;
  label: string;
  required?: boolean;
  size?: "lg" | "sm";
};

const ImageUploadCard = ({
  value,
  onChange,
  folder,
  label,
  required = false,
  size = "lg",
}: ImageUploadCardPropsType) => {
  const heightClass =
    size === "lg" ? "h-48 sm:h-56" : "h-32 sm:h-36";

  if (!value) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed border-light-gray bg-cream px-3 transition-colors hover:border-gold ${heightClass}`}
      >
        <svg
          className="h-6 w-6 text-gray"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 8.25L12 3.75m0 0L7.5 8.25M12 3.75v12.75"
          />
        </svg>
        <p className="text-[11px] tracking-[0.14em] uppercase text-charcoal font-semibold text-center">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </p>
        <ImageUploader
          folder={folder}
          label="Upload Image"
          fullWidth
          onUploaded={(url) => {
            onChange({ url, altText: "" });
            toast.success("Image uploaded.");
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full border border-light-gray ${heightClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={value.url}
        alt={value.altText || label}
        className="h-full w-full object-cover"
      />

      {required && (
        <span className="absolute top-2 left-2 bg-charcoal text-white text-[10px] tracking-wide uppercase px-2 py-1">
          Banner
        </span>
      )}

      <div className="absolute top-2 right-2 flex gap-1.5">
        <ImageUploader
          compact
          folder={folder}
          label="Replace image"
          onUploaded={(url) => {
            onChange({ url, altText: value.altText });
            toast.success("Image replaced.");
          }}
        />
        {!required && (
          <button
            type="button"
            aria-label={`Remove ${label}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center bg-charcoal/70 text-white text-[15px] leading-none backdrop-blur-sm hover:bg-charcoal"
            onClick={() => onChange(null)}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploadCard;
