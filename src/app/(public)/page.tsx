import CTABannerSection from "@/components/home/CTABannerSection";
import GallerySection from "@/components/home/GallerySection";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import SubscribeSection from "@/components/home/SubscribeSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import WorkshopExperienceSection from "@/components/home/WorkshopExperienceSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <WorkshopExperienceSection />
      <GallerySection />
      <TestimonialsSection />
      <CTABannerSection />
      <SubscribeSection />
    </div>
  );
}
