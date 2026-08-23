import type { Metadata } from "next";
import VideosSection from "@/components/videos/VideosSection";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Watch resin art technique videos and workshop highlights from Resin Art by Tanvi in Calgary.",
  openGraph: {
    url: "/videos",
  },
};

const Page = () => {
  return <VideosSection />;
};

export default Page;
