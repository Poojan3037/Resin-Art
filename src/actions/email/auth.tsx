"use server";

import PasswordResetEmail from "@/components/email-templates/auth/PasswordResetEmail";
import { render } from "@react-email/render";
import { getResend } from "@/lib/resend";

export const sendPasswordResetEmail = async (args: {
  toName: string;
  toEmail: string;
  resetUrl: string;
}) => {
  const fromEmail = process.env.FROM_EMAIL ?? "noreply@example.com";

  const html = await render(
    <PasswordResetEmail name={args.toName} resetUrl={args.resetUrl} />,
  );

  await getResend().emails.send({
    from: fromEmail,
    to: args.toEmail,
    subject: "Reset your password",
    html,
  });
};
