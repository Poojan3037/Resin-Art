"use server";

import OrderConfirmationEmail from "@/components/email-templates/order/OrderConfirmationEmail";
import OrderStatusEmail from "@/components/email-templates/order/OrderStatusEmail";
import { SendOrderConfirmationArgs, SendOrderStatusArgs } from "@/types/order";

import { render } from "@react-email/render";
import { getResend } from "@/lib/resend";

export const sendOrderConfirmationEmail = async (
  args: SendOrderConfirmationArgs,
) => {
  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@example.com";
  const fromEmail = process.env.FROM_EMAIL ?? "noreply@example.com";

  const html = await render(
    <OrderConfirmationEmail
      name={args.toName}
      orderNumber={args.orderNumber}
      orderId={args.orderId}
      items={args.items.map((item) => ({
        ...item,
        unitPrice: String(item.unitPrice),
        lineTotal: String(item.lineTotal),
      }))}
      totalAmount={String(args.totalAmount)}
      address={args.address}
      receiptUrl={args.receiptUrl}
      supportEmail={supportEmail}
    />,
  );

  await getResend().emails.send({
    from: fromEmail,
    to: args.toEmail,
    subject: `Order Confirmed: ${args.orderNumber}`,
    html,
  });
};

export const sendOrderStatusEmail = async (args: SendOrderStatusArgs) => {
  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@example.com";
  const fromEmail = process.env.FROM_EMAIL ?? "noreply@example.com";

  const html = await render(
    <OrderStatusEmail
      name={args.toName}
      orderNumber={args.orderNumber}
      orderId={args.orderId}
      status={args.status}
      supportEmail={supportEmail}
    />,
  );

  await getResend().emails.send({
    from: fromEmail,
    to: args.toEmail,
    subject: `Order Update: ${args.orderNumber}`,
    html,
  });
};
