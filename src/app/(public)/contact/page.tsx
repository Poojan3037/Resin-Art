import type { Metadata } from "next";
import { Suspense } from "react";
import ContactSection from "@/components/contact/ContactSection";
import ContactFormSkeleton from "@/components/skeleton/ContactFormSkeleton";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Resin Art by Tanvi. Inquire about workshops, custom resin orders, private parties, or corporate events in Calgary.",
  openGraph: {
    url: "/contact",
  },
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <ContactFormSkeleton />
        </div>
      }
    >
      <ContactSection />
    </Suspense>
  );
};

export default Page;
