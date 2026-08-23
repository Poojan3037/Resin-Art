import type { Metadata } from "next";
import { Suspense } from "react";
import ContactSection from "@/components/contact/ContactSection";

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
    <Suspense fallback={null}>
      <ContactSection />
    </Suspense>
  );
};

export default Page;
