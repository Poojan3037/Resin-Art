"use server";

import prisma from "@/lib/prisma";
import { checkRateLimitByIp, rateLimitMessage } from "@/lib/rate-limit";
import { SubscribeSchema } from "@/schema/subscriber";
import type { NotifyTargetType, SubscriberType } from "@/types/subscriber";
import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import { revalidatePath } from "next/cache";
import { verifySession } from "./dal";
import { sendAnnouncementEmails } from "./email/announcement";

const SUCCESS_MESSAGE = "You're on the list. We'll be in touch!";

const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const formatCad = (amount: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);

/**
 * Public notify-me signup. Takes `unknown` because it is reachable by anyone;
 * the payload is validated server-side rather than trusted from the client.
 */
export const subscribe = async (
  data: unknown,
): Promise<{ success: boolean; message: string }> => {
  const parsed = SubscribeSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Enter a valid email address",
    };
  }

  // Unauthenticated write endpoint: without a limit it is a free way to stuff
  // the subscriber table (and, later, the outgoing mail volume).
  const limit = await checkRateLimitByIp("subscribe");
  if (!limit.allowed) {
    return {
      success: false,
      message: rateLimitMessage(limit.retryAfterSeconds),
    };
  }

  try {
    // Upsert so a repeat signup is a no-op instead of a unique-constraint
    // error. The response is identical either way: telling the visitor that an
    // address is "already subscribed" would turn this into a membership oracle.
    await prisma.subscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: {
        email: parsed.data.email,
        source: parsed.data.source ?? null,
      },
    });

    revalidatePath("/admin/subscribers");

    return { success: true, message: SUCCESS_MESSAGE };
  } catch (error) {
    console.error("[subscriber] signup failed:", error);
    return {
      success: false,
      message: "Could not save your email. Please try again later.",
    };
  }
};

export const getSubscribers = async ({
  search,
}: {
  search: string;
}): Promise<SubscriberType[]> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return [];

  try {
    const subscribers = await prisma.subscriber.findMany({
      where: search
        ? { email: { contains: search, mode: "insensitive" } }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return subscribers.map((subscriber) => ({
      id: subscriber.id,
      email: subscriber.email,
      source: subscriber.source,
      createdAt: subscriber.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("[subscriber] list failed:", error);
    return [];
  }
};

export const getSubscriberCount = async (): Promise<number> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return 0;

  try {
    return await prisma.subscriber.count();
  } catch (error) {
    console.error("[subscriber] count failed:", error);
    return 0;
  }
};

export const deleteSubscriber = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  try {
    await prisma.subscriber.delete({ where: { id } });
    revalidatePath("/admin/subscribers");

    return { success: true, message: "Subscriber removed." };
  } catch (error) {
    console.error("[subscriber] delete failed:", error);
    return {
      success: false,
      message: "Could not remove subscriber. Please try again.",
    };
  }
};

/**
 * Admin-triggered announcement. Awaited rather than fire-and-forget (unlike the
 * transactional emails): the admin pressed a button and needs the real outcome.
 */
export const notifySubscribers = async (
  target: NotifyTargetType,
): Promise<{ success: boolean; message: string }> => {
  const { isUserVerified } = await verifySession({ isAdmin: true });
  if (!isUserVerified) return { success: false, message: "Unauthorized." };

  try {
    const announcement = await buildAnnouncement(target);
    if (!announcement) {
      return {
        success: false,
        message:
          target.type === "workshop"
            ? "This workshop is not visible to users yet. Publish it before notifying subscribers."
            : "This product is not published yet. Publish it before notifying subscribers.",
      };
    }

    const subscribers = await prisma.subscriber.findMany({
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return { success: false, message: "No subscribers to notify yet." };
    }

    const { sent, failed } = await sendAnnouncementEmails({
      recipients: subscribers.map((subscriber) => subscriber.email),
      announcement,
    });

    if (sent === 0) {
      return {
        success: false,
        message: "Could not send the announcement. Please try again later.",
      };
    }

    // Stamped only when something actually went out, so the "already announced"
    // warning never lies about a send that wholly failed.
    if (target.type === "workshop") {
      await prisma.workshop.update({
        where: { id: target.id },
        data: { lastNotifiedAt: new Date() },
      });
      revalidatePath("/admin/workshops");
    } else {
      await prisma.product.update({
        where: { id: target.id },
        data: { lastNotifiedAt: new Date() },
      });
      revalidatePath("/admin/products");
    }

    if (failed > 0) {
      return {
        success: true,
        message: `Sent to ${sent} subscriber${sent === 1 ? "" : "s"}, but ${failed} failed. Check the logs.`,
      };
    }

    return {
      success: true,
      message: `Sent to ${sent} subscriber${sent === 1 ? "" : "s"}.`,
    };
  } catch (error) {
    console.error("[subscriber] notify failed:", error);
    return {
      success: false,
      message: "Could not send the announcement. Please try again later.",
    };
  }
};

/**
 * Loads the item and shapes it for the email — returning null when it is not
 * publicly visible, since the announcement would link somewhere the recipient
 * cannot reach.
 */
const buildAnnouncement = async (target: NotifyTargetType) => {
  if (target.type === "workshop") {
    const workshop = await prisma.workshop.findFirst({
      where: { id: target.id, showToUsers: true, status: "UPCOMING" },
    });
    if (!workshop) return null;

    return {
      type: "workshop" as const,
      title: workshop.title,
      description: workshop.description ?? "",
      price: formatCad(workshop.priceCents / 100),
      ctaUrl: `${siteUrl()}/workshops`,
      dateLabel: formatWorkshopDate(workshop.date),
      timeLabel: formatWorkshopTime(workshop),
      location: workshop.location,
    };
  }

  const product = await prisma.product.findFirst({
    where: { id: target.id, status: "PUBLISHED" },
    include: {
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
      },
    },
  });
  if (!product) return null;

  const price = product.discountPrice ?? product.price;

  return {
    type: "product" as const,
    title: product.title,
    description: product.description,
    price: formatCad(Number(price)),
    ctaUrl: `${siteUrl()}/shop/${product.slug}`,
    imageUrl: product.images[0]?.url,
  };
};
