import CTABannerSection from "@/components/home/CTABannerSection";
import GallerySection from "@/components/home/GallerySection";
import HeroSection from "@/components/home/hero-section/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import InstagramSection from "@/components/home/InstagramSection";
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
      <InstagramSection />
      <CTABannerSection />
      <SubscribeSection />
    </div>
  );
}
