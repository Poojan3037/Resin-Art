import type { SUBSCRIBER_SOURCES } from "@/schema/subscriber";

export type SubscriberSourceType = (typeof SUBSCRIBER_SOURCES)[number];

/** Client-safe subscriber row: dates serialized at the server boundary. */
export type SubscriberType = {
  id: string;
  email: string;
  source: string | null;
  createdAt: string;
};

/** What an announcement email needs to render, for either item type. */
export type AnnouncementEmailProps = {
  type: "workshop" | "product";
  title: string;
  description: string;
  price: string;
  ctaUrl: string;
  /** Workshop-only rows. */
  dateLabel?: string;
  timeLabel?: string;
  location?: string;
  /** Product-only hero image. */
  imageUrl?: string;
};

export type NotifyTargetType = {
  type: "workshop" | "product";
  id: string;
};
