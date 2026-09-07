import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
} from "@react-email/components";
import {
  body,
  container,
  goldBar,
  header,
  heading,
  subheading,
  card,
  cardLabel,
  divider,
  orderNumber,
  orderId,
  orderIdLabel,
  statusBadgeWrapper,
  statusBadgeBase,
  statusDescText,
  footerSection,
  footerNote,
  supportLink,
  footerCopy,
  bodyContainer,
} from "./css";
import type { OrderStatus } from "../../../../prisma/generated/prisma/client";
import { StatusInfoType } from "@/types/order";

type PropsType = {
  name: string;
  orderNumber: string;
  orderId: string;
  status: OrderStatus;
  supportEmail: string;
};

const STATUS_INFO: Record<OrderStatus, StatusInfoType> = {
  PENDING: {
    label: "Pending",
    description:
      "We've received your order and it's awaiting confirmation from our team.",
    badgeColor: "#FEF3C7",
    badgeTextColor: "#92400E",
  },
  CONFIRMED: {
    label: "Order Confirmed",
    description:
      "Your order has been confirmed and is being prepared for shipment.",
    badgeColor: "#DBEAFE",
    badgeTextColor: "#1E3A8A",
  },
  PROCESSING: {
    label: "Processing",
    description:
      "Your order is currently being processed and carefully packed by our team.",
    badgeColor: "#CCFBF1",
    badgeTextColor: "#134E4A",
  },
  SHIPPED: {
    label: "Shipped",
    description:
      "Great news — your order is on its way! You should receive it soon.",
    badgeColor: "#E0E7FF",
    badgeTextColor: "#3730A3",
  },
  DELIVERED: {
    label: "Delivered",
    description:
      "Your order has been delivered. We hope you enjoy your new artwork!",
    badgeColor: "#D1FAE5",
    badgeTextColor: "#065F46",
  },
  FAILED: {
    label: "Payment Failed",
    description:
      "We were not able to complete the payment for this order, so it has not been placed. Any amount held has been released.",
    badgeColor: "#f5f5f5",
    badgeTextColor: "#525252",
  },
  CANCELLED: {
    label: "Cancelled",
    description:
      "Your order has been cancelled. If this was unexpected, please reach out to our support team.",
    badgeColor: "#FCE7F3",
    badgeTextColor: "#831843",
  },
};

const OrderStatusEmail = ({
  name,
  orderNumber: orderNum,

  status,
  supportEmail,
}: PropsType) => {
  const info = STATUS_INFO[status];

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Order {orderNum} — Status update: {info.label}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Gold accent bar */}
          <Section style={goldBar} />

          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>Order Update</Heading>
            <Text style={subheading}>
              Hi {name}, your order status has been updated.
            </Text>
          </Section>

          {/* Status badge */}
          <Section style={statusBadgeWrapper}>
            <Text
              style={{
                ...statusBadgeBase,
                backgroundColor: info.badgeColor,
                color: info.badgeTextColor,
              }}
            >
              {info.label}
            </Text>
          </Section>

          {/* Status description */}
          <Text style={statusDescText}>{info.description}</Text>

          <Section style={bodyContainer}>
            {/* Order reference card */}
            <Section style={{ ...card, marginTop: "24px" }}>
              <Text style={cardLabel}>Order Reference</Text>
              <Text style={orderNumber}>{orderNum}</Text>
            </Section>

            <Hr style={divider} />
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerNote}>
              Questions about your order? Contact us at{" "}
              <Link href={`mailto:${supportEmail}`} style={supportLink}>
                {supportEmail}
              </Link>{" "}
              and we&apos;ll be happy to help.
            </Text>
            <Text style={footerCopy}>
              © {new Date().getFullYear()} — All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderStatusEmail;
