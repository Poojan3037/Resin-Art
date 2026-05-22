"use client";

import Button from "@/components/Button";
import { CldUploadWidget } from "next-cloudinary";

type ImageUploaderPropsType = {
  onUploaded: (url: string) => void;
};

const ImageUploader = ({ onUploaded }: ImageUploaderPropsType) => {
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
        folder: "resin-art/products",
        resourceType: "image",
      }}
      onSuccess={(result) => {
        const response = result?.info as { secure_url?: string } | undefined;
        if (!response?.secure_url) return;
        onUploaded(response.secure_url);
      }}
    >
      {({ open }) => (
        <Button type="button" variant="soft" onClick={() => open?.()}>
          Upload from Cloudinary
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default ImageUploader;
