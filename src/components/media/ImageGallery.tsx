"use client";

import { useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type GalleryImageType = {
  id?: string;
  url: string;
  altText?: string | null;
};

type ImageGalleryPropsType = {
  bannerUrl: string;
  bannerAlt: string;
  images: GalleryImageType[];
  fallbackUrl?: string;
};

const ImageGallery = ({
  bannerUrl,
  bannerAlt,
  images,
  fallbackUrl = "/images/art/resin-art-1.jpg",
}: ImageGalleryPropsType) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const resolvedBanner = bannerUrl || fallbackUrl;
  const galleryImages = images.length > 0 ? images : [];
  const thumbnails = galleryImages.filter(
    (image) => image.url !== resolvedBanner,
  );
  const allImages: GalleryImageType[] = [
    { url: resolvedBanner, altText: bannerAlt },
    ...thumbnails,
  ];

  const openLightboxAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => openLightboxAt(0)}
        className="block w-full border border-light-gray bg-white overflow-hidden cursor-zoom-in"
        aria-label="View banner image full size"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedBanner}
          alt={bannerAlt}
          className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[4/3] lg:aspect-square"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackUrl;
          }}
        />
      </button>

      {thumbnails.length > 0 && (
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => scrollThumbnails("left")}
            className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-light-gray shadow-md text-gray-700 transition-all duration-200 hover:shadow-lg hover:scale-110 active:scale-95"
            aria-label="Scroll thumbnails left"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex flex-1 min-w-0 gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {thumbnails.map((image, i) => (
              <button
                key={image.id ?? `${image.url}-${i}`}
                type="button"
                onClick={() => openLightboxAt(i + 1)}
                className="flex-shrink-0 snap-start w-20 sm:w-24 border border-light-gray bg-white overflow-hidden cursor-zoom-in transition-all duration-200 hover:scale-105 hover:shadow-md hover:border-gray-400"
                aria-label={`View gallery image ${i + 1} full size`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.altText ?? bannerAlt}
                  className="w-full h-20 sm:h-24 object-cover transition-transform duration-300"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbnails("right")}
            className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-light-gray shadow-md text-gray-700 transition-all duration-200 hover:shadow-lg hover:scale-110 active:scale-95"
            aria-label="Scroll thumbnails right"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M9 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={allImages.map((image) => ({
          src: image.url,
          alt: image.altText ?? bannerAlt,
        }))}
        plugins={[Thumbnails, Zoom]}
      />
    </div>
  );
};

export default ImageGallery;
