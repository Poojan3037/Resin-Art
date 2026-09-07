import Skeleton from "@/components/skeleton/Skeleton";
import ContactFormSkeleton from "@/components/skeleton/ContactFormSkeleton";
import PageHeroSkeleton from "@/components/skeleton/PageHeroSkeleton";

const ContactLoadingPage = () => (
  <div>
    <PageHeroSkeleton />
    <div className="max-w-7xl mx-auto py-14 sm:py-20 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
      <ContactFormSkeleton />
      <div className="space-y-8">
        <Skeleton className="h-9 w-52 mb-9" />
        {["loc", "ig", "mail"].map((key) => (
          <div key={key} className="flex gap-5 pb-8 border-b border-light-gray">
            <Skeleton className="h-8 w-8 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        ))}
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  </div>
);

export default ContactLoadingPage;
