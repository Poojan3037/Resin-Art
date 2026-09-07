import type { Metadata } from "next";
import WorkshopCardSkeleton from "@/components/skeleton/WorkshopCardSkeleton";
import WorkshopInquirySection from "@/components/workshop/WorkshopInquirySection";
import WorkshopListLoader from "@/components/workshop/WorkshopListLoader";
import WorkshopsHero from "@/components/workshop/WorkshopsHero";
import { Suspense } from "react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Resin Art Workshops",
  provider: {
    "@type": "LocalBusiness",
    name: "Resin Art by Tanvi",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
  },
  description:
    "Beginner-friendly and advanced resin art workshops in Calgary. Book a group session, Sip & Create event, or private party.",
  offers: {
    "@type": "Offer",
    priceCurrency: "CAD",
    lowPrice: "85",
    highPrice: "95",
  },
  areaServed: {
    "@type": "Place",
    name: "Calgary, AB",
  },
};

export const metadata: Metadata = {
  title: "Resin Art Workshops in Calgary",
  description:
    "Book a resin art workshop in Calgary. Beginner-friendly sessions, Sip & Create events, private parties, and corporate bookings. Starting from $85 CAD.",
  openGraph: {
    url: "/workshops",
    images: [
      {
        url: "/images/workshops/highlight-1.jpg",
        width: 1200,
        height: 630,
        alt: "Resin art workshop in Calgary",
      },
    ],
  },
};

const Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <WorkshopsHero />

        <div className="max-w-7xl mx-auto py-14 sm:py-18 px-4 sm:px-6 lg:px-8">
          {/* Workshop cards */}

          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-20">
                {new Array(3).fill(0).map((item, index) => {
                  return <WorkshopCardSkeleton key={item + index} />;
                })}
              </div>
            }
          >
            <WorkshopListLoader />
          </Suspense>

          {/* Inquiry sections */}
          <WorkshopInquirySection />
        </div>
      </div>
    </>
  );
};

export default Page;
