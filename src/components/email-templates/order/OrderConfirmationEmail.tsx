import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
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
  thinDivider,
  divider,
  orderNumber,
  orderId,
  orderIdLabel,
  itemRow,
  itemTitle,
  itemMeta,
  itemPrice,
  summaryCard,
  summaryLabel,
  summaryTotal,
  receiptLink,
  addressText,
  footerSection,
  footerNote,
  supportLink,
  footerCopy,
  bodyContainer,
} from "./css";
import { AddressType, OrderItemType } from "@/types/order";

type PropsType = {
  name: string;
  orderNumber: string;
  orderId: string;
  items: Pick<
    OrderItemType,
    "productTitle" | "artistName" | "quantity" | "unitPrice" | "lineTotal"
  >[];
  totalAmount: string;
  address: AddressType;
  receiptUrl: string | null;
  supportEmail: string;
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const formatAddress = (address: AddressType) => {
  const lines = [address.addressLine1];
  if (address.addressLine2) lines.push(address.addressLine2);
  lines.push(
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  );
  return lines.join("\n");
};

const OrderConfirmationEmail = ({
  name,
  orderNumber: orderNum,
  items,
  totalAmount,
  address,
  receiptUrl,
  supportEmail,
}: PropsType) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        Order {orderNum} confirmed — your artwork is on its way!
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Gold accent bar */}
          <Section style={goldBar} />

          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>Order Confirmed</Heading>
            <Text style={subheading}>
              Thank you, {name}! Your order has been placed successfully.
            </Text>
          </Section>

          <Section style={bodyContainer}>
            {/* Order reference card */}
            <Section style={card}>
              <Text style={cardLabel}>Order Reference</Text>
              <Text style={orderNumber}>{orderNum}</Text>
            </Section>

            {/* Items card */}
            <Section style={{ ...card, marginTop: "16px" }}>
              <Text style={cardLabel}>Items Ordered</Text>
              <Hr style={thinDivider} />
              {items.map((item) => (
                <Row key={item.productTitle} style={itemRow}>
                  <Column style={{ width: "70%" }}>
                    <Text style={itemTitle}>{item.productTitle}</Text>
                    <Text style={itemMeta}>
                      {item.artistName} · {item.quantity} ×{" "}
                      {currencyFormatter.format(Number(item.unitPrice))}
                    </Text>
                  </Column>
                  <Column style={{ width: "30%" }}>
                    <Text style={itemPrice}>
                      {currencyFormatter.format(Number(item.lineTotal))}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Total summary */}
            <Section style={summaryCard}>
              <Row>
                <Column>
                  <Text style={summaryLabel}>Shipping</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ ...summaryLabel, textAlign: "right" }}>
                    Free
                  </Text>
                </Column>
              </Row>
              <Row style={{ marginTop: "8px" }}>
                <Column>
                  <Text
                    style={{
                      ...summaryLabel,
                      fontWeight: "700",
                      color: "#2B2B2B",
                    }}
                  >
                    Total (CAD)
                  </Text>
                </Column>
                <Column>
                  <Text style={summaryTotal}>
                    {currencyFormatter.format(Number(totalAmount))}
                  </Text>
                </Column>
              </Row>
              {receiptUrl && (
                <Link href={receiptUrl} style={receiptLink}>
                  View Square Receipt →
                </Link>
              )}
            </Section>

            {/* Delivery address */}
            <Section style={{ ...card, marginTop: "16px" }}>
              <Text style={cardLabel}>Delivery Address</Text>
              <Text style={addressText}>{formatAddress(address)}</Text>
            </Section>

            <Hr style={divider} />
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerNote}>
              Need to cancel your order? Contact us at{" "}
              <Link href={`mailto:${supportEmail}`} style={supportLink}>
                {supportEmail}
              </Link>{" "}
              and our team will be happy to assist you.
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

export default OrderConfirmationEmail;
