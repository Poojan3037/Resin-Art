import { getWorkshops } from "@/actions/workshop";
import WorkshopCard from "./WorkshopCard";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE } from "@/constants/cache";

const WorkshopList = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE.WORKSHOP);

  const workshops = await getWorkshops();

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
