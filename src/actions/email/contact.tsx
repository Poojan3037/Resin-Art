"use server";

import ContactInquiryEmail from "@/components/email-templates/contact/ContactInquiryEmail";
import { ContactSchema } from "@/schema/contact";
import { ContactActionArgs } from "@/types/contact";
import { render } from "@react-email/render";
import { Resend } from "resend";
import { checkRateLimitByIp, rateLimitMessage } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactInquiry = async (
  args: ContactActionArgs,
): Promise<{ success: boolean; message: string }> => {
  const parsed = ContactSchema.safeParse(args);
  if (!parsed.success) {
    return { success: false, message: "Invalid form data. Please try again." };
  }

  // Open mail relay otherwise: this sends on behalf of anyone who can reach it.
  const limit = await checkRateLimitByIp("contact");
  if (!limit.allowed) {
    return { success: false, message: rateLimitMessage(limit.retryAfterSeconds) };
  }

  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@example.com";
  const fromEmail = process.env.FROM_EMAIL ?? "noreply@example.com";

  const emailSubject = parsed.data.subject
    ? `Inquiry: ${parsed.data.subject}`
    : "New Contact Form Submission";

  try {
    const html = await render(
      <ContactInquiryEmail
        name={parsed.data.name}
        email={parsed.data.email}
        message={parsed.data.message}
        subject={parsed.data.subject}
      />,
    );

    await resend.emails.send({
      from: fromEmail,
      to: supportEmail,
      replyTo: parsed.data.email,
      subject: emailSubject,
      html,
    });

    return { success: true, message: "Your message has been sent!" };
  } catch {
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    };
  }
};
