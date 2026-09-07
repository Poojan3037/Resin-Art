"use client";

import Button, { type ButtonVariant } from "@/components/Button";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";

type ImageUploaderPropsType = {
  onUploaded: (url: string) => void;
  folder: string;
  label?: string;
  fullWidth?: boolean;
  className?: string;
  variant?: ButtonVariant;
  compact?: boolean;
};

const ImageUploader = ({
  onUploaded,
  folder,
  label = "Upload from Cloudinary",
  fullWidth = false,
  className,
  variant = "soft",
  compact = false,
}: ImageUploaderPropsType) => {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    return (
      <p className="text-[12px] text-gray">
        Missing `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
      </p>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{
        multiple: false,
        folder,
        resourceType: "image",
      }}
      onSuccess={(result) => {
        const response = result?.info as { secure_url?: string } | undefined;
        if (!response?.secure_url) return;
        onUploaded(response.secure_url);
      }}
      onError={() => {
        toast.error("Upload failed. Please try again.");
      }}
    >
      {({ open }) =>
        compact ? (
          <button
            type="button"
            aria-label={label}
            title={label}
            onClick={() => open?.()}
            className={
              className ??
              "flex h-8 w-8 shrink-0 items-center justify-center bg-charcoal/70 text-white backdrop-blur-sm hover:bg-charcoal"
            }
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5v4.75A2.25 2.25 0 0117.25 20.5H5.75A2.25 2.25 0 013.5 18.25V6.75A2.25 2.25 0 015.75 4.5h4.75"
              />
            </svg>
          </button>
        ) : (
          <Button
            type="button"
            variant={variant}
            size="sm"
            fullWidth={fullWidth}
            className={className}
            onClick={() => open?.()}
          >
            {label}
          </Button>
        )
      }
    </CldUploadWidget>
  );
};

export default ImageUploader;
