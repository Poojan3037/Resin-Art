import { getWorkshops } from "@/actions/workshop";
import WorkshopCard from "./WorkshopCard";
import NotifyMeForm from "@/components/NotifyMeForm";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE } from "@/constants/cache";

/** `todayKey` is a prop, not a call, so it forms part of the cache key below. */
const WorkshopList = async ({ todayKey }: { todayKey: string }) => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE.WORKSHOP);

  const workshops = await getWorkshops(todayKey);

  // `getWorkshops` already filters to visible, upcoming, not-yet-past
  // workshops, so an empty list means there is genuinely nothing to book.
  if (workshops.length === 0) {
    return (
      <div className="bg-white border border-light-gray p-10 sm:p-12 text-center mb-16 sm:mb-20">
        <h3 className="text-[20px] sm:text-[24px] text-charcoal mb-2.5">
          No workshops scheduled right now
        </h3>
        <p className="text-[14px] text-gray mb-8 max-w-lg mx-auto">
          New dates are added regularly. Leave your email and we&apos;ll let you
          know the moment the next session opens for booking.
        </p>
        <NotifyMeForm source="workshops" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-20">
      {workshops.map((workshop, index) => {
        return (
          <WorkshopCard key={workshop.id} workshop={workshop} index={index} />
        );
      })}
    </div>
  );
};

export default WorkshopList;
