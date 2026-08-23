import WorkshopConfirmationEmail from "@/components/email-templates/workshop/WorkshopConfirmationEmail";
import { SendConfirmationArgs } from "@/types/workshop";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWorkshopConfirmationEmail = async (
  args: SendConfirmationArgs,
) => {
  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@example.com";
  const fromEmail = process.env.FROM_EMAIL ?? "noreply@example.com";

  const html = await render(
    <WorkshopConfirmationEmail
      name={args.toName}
      seats={args.seats}
      subtotal={args.subtotal}
      taxAmount={args.taxAmount}
      taxLines={args.taxLines}
      totalPrice={args.totalPrice}
      workshop={args.workshop}
      receiptUrl={args.receiptUrl}
      supportEmail={supportEmail}
    />,
  );

  await resend.emails.send({
    from: fromEmail,
    to: args.toEmail,
    subject: `Booking Confirmed: ${args.workshop.title}`,
    html,
  });
};
