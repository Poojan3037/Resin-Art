import type { Metadata } from "next";
import AboutSection from "@/components/about/AboutSection";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Resin Art by Tanvi",
  description:
    "A Calgary-based resin art studio offering small-group workshops and handcrafted resin home d\u00e9cor.",
  founder: {
    "@type": "Person",
    name: "Tanvi",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Calgary",
    addressRegion: "AB",
    addressCountry: "CA",
  },
};

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Tanvi \u2014 a Calgary-based resin artist offering small-group workshops and handcrafted resin home d\u00e9cor. Learn about the studio's story and values.",
  openGraph: {
    url: "/about",
  },
};

const Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutSection />
    </>
  );
};

export default Page;
