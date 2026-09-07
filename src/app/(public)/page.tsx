import type { Metadata } from "next";
import { Suspense } from "react";
import CTABannerSection from "@/components/home/CTABannerSection";
import EventSection from "@/components/home/EventSection";
import HeroSectionLoader from "@/components/home/hero-section/HeroSectionLoader";
import HeroSkeleton from "@/components/skeleton/HeroSkeleton";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import InstagramSection from "@/components/home/InstagramSection";
import SubscribeSection from "@/components/home/SubscribeSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WorkshopExperienceSection from "@/components/home/WorkshopExperienceSection";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Resin Art by Tanvi",
  description:
    "Handcrafted resin art workshops and products in Calgary, AB. Small groups, premium materials, 5\u2605 rated.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    reviewCount: "40",
  },
};

export const metadata: Metadata = {
  title: {
    absolute:
      "Resin Art by Tanvi \u2014 Workshops & Handcrafted Resin Art in Calgary",
  },
  description:
    "Join resin art workshops or shop handcrafted resin trays, coasters, and paintings in Calgary. Small groups, premium materials, 5\u2605 rated.",
  openGraph: {
    url: "/",
    title:
      "Resin Art by Tanvi \u2014 Workshops & Handcrafted Resin Art in Calgary",
    description:
      "Join resin art workshops or shop handcrafted resin trays, coasters, and paintings in Calgary. Small groups, premium materials, 5\u2605 rated.",
    images: [
      {
        url: "/images/art/art-1.jpg",
        width: 1200,
        height: 630,
        alt: "Handcrafted resin art by Tanvi",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSectionLoader />
        </Suspense>
        <HowItWorksSection />
        <WorkshopExperienceSection />
        <EventSection />
        <TestimonialsSection />
        <InstagramSection />
        <CTABannerSection />
        <SubscribeSection />
      </div>
    </>
  );
}
