import { connection } from "next/server";
import WorkshopList from "./WorkshopList";
import { getTodayKey } from "@/lib/workshop-date";

/**
 * Uncached shell around the cached list — see `HeroSectionLoader` for why the
 * day key is read here rather than inside the `"use cache"` scope.
 */
const WorkshopListLoader = async () => {
  await connection();
  return <WorkshopList todayKey={getTodayKey()} />;
};

export default WorkshopListLoader;
