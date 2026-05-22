import WorkshopCardSkeleton from "@/components/skeleton/WorkshopCardSkeleton";
import WorkshopInquirySection from "@/components/workshop/WorkshopInquirySection";
import WorkshopList from "@/components/workshop/WorkshopList";
import WorkshopsHero from "@/components/workshop/WorkshopsHero";
import { Suspense } from "react";

const Page = () => {
  return (
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
          <WorkshopList />
        </Suspense>

        {/* Inquiry sections */}
        <WorkshopInquirySection />
      </div>
    </div>
  );
};

export default Page;
