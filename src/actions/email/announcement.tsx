"use server";

import AnnouncementEmail from "@/components/email-templates/announcement/AnnouncementEmail";
import type { AnnouncementEmailProps } from "@/types/subscriber";
import { render } from "@react-email/render";
import { getResend } from "@/lib/resend";

/** Resend caps a single batch call at 100 messages. */
const BATCH_SIZE = 100;

export type AnnouncementSendResultType = {
  sent: number;
  failed: number;
};

/**
 * Fans one announcement out to the whole notify-me list.
 *
 * Sent as individual messages via `batch.send` rather than one email with many
 * recipients: a shared To/BCC header would leak subscriber addresses to each
 * other. Batches run sequentially to stay under Resend's request rate limit,
 * and a failed batch is counted rather than thrown so one bad chunk does not
 * abandon the remaining subscribers.
 */
export const sendAnnouncementEmails = async ({
  recipients,
  announcement,
}: {
  recipients: string[];
  announcement: AnnouncementEmailProps;
}): Promise<AnnouncementSendResultType> => {
  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@example.com";
  const fromEmail = process.env.FROM_EMAIL ?? "noreply@example.com";

  const subject =
    announcement.type === "workshop"
      ? `New workshop: ${announcement.title}`
      : `New in the shop: ${announcement.title}`;

  // Identical for every recipient, so render once rather than per email.
  const html = await render(
    <AnnouncementEmail {...announcement} supportEmail={supportEmail} />,
  );

  let sent = 0;
  let failed = 0;

  for (let index = 0; index < recipients.length; index += BATCH_SIZE) {
    const chunk = recipients.slice(index, index + BATCH_SIZE);

    try {
      const { error } = await getResend().batch.send(
        chunk.map((to) => ({ from: fromEmail, to, subject, html })),
      );

      if (error) {
        console.error("[announcement] batch rejected:", error);
        failed += chunk.length;
      } else {
        sent += chunk.length;
      }
    } catch (error) {
      console.error("[announcement] batch send threw:", error);
      failed += chunk.length;
    }
  }

  return { sent, failed };
};
