import { connection } from "next/server";
import HeroSection from "./HeroSection";
import { getTodayKey } from "@/lib/workshop-date";

/**
 * Uncached shell around the cached hero.
 *
 * "Which workshops have not happened yet?" depends on the current date, and
 * Cache Components refuses a clock read inside a prerendered component — so
 * the read happens here, behind `connection()`, and the resulting day key is
 * passed into `HeroSection`'s `"use cache"` scope as part of its key. The
 * cache entry therefore rolls over on its own at local midnight instead of
 * serving yesterday's list until it expires.
 */
const HeroSectionLoader = async () => {
  await connection();
  return <HeroSection todayKey={getTodayKey()} />;
};

export default HeroSectionLoader;
