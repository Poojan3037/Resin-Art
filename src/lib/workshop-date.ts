/**
 * Workshops are sold and held in Alberta, so "has this event passed?" must be
 * answered in the studio's timezone — not the server's and not UTC. An event
 * on the 5th is still upcoming at 11pm on the 5th in Calgary, even though it
 * is already the 6th in UTC.
 */
const BUSINESS_TIME_ZONE = "America/Edmonton";

/**
 * Today in the studio's timezone as "YYYY-MM-DD".
 *
 * This is deliberately a plain string: it is passed into `"use cache"`
 * components as a prop so it becomes part of the cache key. Without that, a
 * date filter computed inside the cached function would freeze at whatever
 * "today" was when the entry was written and only roll over when the cache
 * expired.
 */
export const getTodayKey = (): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

/**
 * The lower bound for "not yet past", as a Date comparable against
 * `Workshop.date`. That column is `@db.Date`, which Prisma reads and writes at
 * UTC midnight, so the bound is built at UTC midnight too.
 *
 * Inclusive: a workshop happening today still counts as upcoming.
 */
export const startOfDayUtc = (todayKey: string): Date =>
  new Date(`${todayKey}T00:00:00.000Z`);
