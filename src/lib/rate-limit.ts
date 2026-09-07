import "server-only";

import { headers } from "next/headers";
import prisma from "@/lib/prisma";

/**
 * Fixed-window rate limiter backed by Postgres via the existing Prisma
 * connection (no extra infrastructure).
 *
 * The public card-charging actions are the reason this exists: without a
 * limiter, `createOrder` / `bookWorkshop` are an unauthenticated oracle an
 * attacker can use to validate stolen cards against the Square account.
 */

export type RateLimitRuleType = { limit: number; windowSeconds: number };

export const RATE_LIMITS = {
  checkout: { limit: 5, windowSeconds: 10 * 60 },
  booking: { limit: 5, windowSeconds: 10 * 60 },
  login: { limit: 5, windowSeconds: 15 * 60 },
  contact: { limit: 3, windowSeconds: 60 * 60 },
  orderLookup: { limit: 10, windowSeconds: 60 * 60 },
  subscribe: { limit: 5, windowSeconds: 60 * 60 },
} satisfies Record<string, RateLimitRuleType>;

export type RateLimitNameType = keyof typeof RATE_LIMITS;

/** Best-effort client IP from proxy headers. */
export const getClientIp = async (): Promise<string> => {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headerList.get("x-real-ip") ?? "unknown";
};

/**
 * Consumes one token. Returns `allowed: false` once the window budget is spent.
 *
 * Fails OPEN on a database error: a limiter outage must not take checkout
 * down. The tradeoff is deliberate and worth revisiting if abuse appears.
 */
export const checkRateLimit = async ({
  name,
  identifier,
}: {
  name: RateLimitNameType;
  identifier: string;
}): Promise<{ allowed: boolean; retryAfterSeconds: number }> => {
  const { limit, windowSeconds } = RATE_LIMITS[name];
  const now = new Date();
  const windowStart = new Date(
    Math.floor(now.getTime() / (windowSeconds * 1000)) * windowSeconds * 1000,
  );
  const key = `${name}:${identifier}`;

  try {
    const record = await prisma.rateLimit.upsert({
      where: { key_windowStart: { key, windowStart } },
      update: { count: { increment: 1 } },
      create: { key, windowStart, count: 1 },
      select: { count: true },
    });

    if (record.count > limit) {
      const resetAt = windowStart.getTime() + windowSeconds * 1000;
      return {
        allowed: false,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((resetAt - now.getTime()) / 1000),
        ),
      };
    }

    return { allowed: true, retryAfterSeconds: 0 };
  } catch (error) {
    console.error("[rate-limit] check failed, failing open:", error);
    return { allowed: true, retryAfterSeconds: 0 };
  }
};

/** Convenience wrapper that keys the limit on the caller's IP. */
export const checkRateLimitByIp = async (name: RateLimitNameType) =>
  checkRateLimit({ name, identifier: await getClientIp() });

export const rateLimitMessage = (retryAfterSeconds: number): string => {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
};
