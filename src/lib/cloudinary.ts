import "server-only";

import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export function getCloudinaryPublicIdFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const uploadSegment = "/upload/";
    const uploadIndex = path.indexOf(uploadSegment);

    if (uploadIndex === -1) return null;

    const versionedPath = path.slice(uploadIndex + uploadSegment.length);
    const segments = versionedPath.split("/");

    // Strip the version segment when present (e.g. v1234567890).
    const withoutVersion =
      segments[0]?.startsWith("v") && /^v\d+$/.test(segments[0])
        ? segments.slice(1)
        : segments;

    const publicPath = withoutVersion.join("/");
    const lastDotIndex = publicPath.lastIndexOf(".");

    if (lastDotIndex === -1) return publicPath;

    return publicPath.slice(0, lastDotIndex);
  } catch {
    return null;
  }
}

export async function deleteCloudinaryAssetByUrl(url: string) {
  const publicId = getCloudinaryPublicIdFromUrl(url);

  if (!publicId) {
    return { result: "not-found", publicId: null } as const;
  }

  const response = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });

  return { result: response.result, publicId } as const;
}
