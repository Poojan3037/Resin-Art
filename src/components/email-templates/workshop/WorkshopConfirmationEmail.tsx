import {
  formatWorkshopDate,
  formatWorkshopTime,
} from "@/lib/workshop-time-formatter";
import { WorkshopEmailProps } from "@/types/workshop";
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
import DetailRow from "./DetailRow";
import {
  body,
  bodyContainer,
  cardLabel,
  container,
  detailsCard,
  divider,
  footerCopy,
  footerNote,
  footerSection,
  goldBar,
  header,
  heading,
  receiptLink,
  subheading,
  summaryCard,
  summaryLeft,
  summaryTotal,
  supportLink,
  thinDivider,
  workshopTitle,
} from "./css";

type PropsType = WorkshopEmailProps;

const WorkshopConfirmationEmail = ({
  name,
  seats,
  subtotal,
  taxAmount,
  taxLines,
  totalPrice,
  workshop,
  receiptUrl,
  supportEmail,
}: PropsType) => {
  const dateLabel = formatWorkshopDate(workshop.date);
  const timeLabel = formatWorkshopTime(workshop);

  return (
    <Html lang="en">
      <Head />
      <Preview>Your booking for {workshop.title} is confirmed!</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Gold accent bar */}
          <Section style={goldBar} />

          {/* Header */}
          <Section style={header}>
            <Heading style={heading}>Booking Confirmed</Heading>
            <Text style={subheading}>
              Thank you, {name}! Your seat{seats > 1 ? "s have" : " has"} been
              reserved.
            </Text>
          </Section>

          {/* Workshop details card */}
          <Section style={bodyContainer}>
            <Section style={detailsCard}>
              <Text style={cardLabel}>Workshop Details</Text>
              <Text style={workshopTitle}>{workshop.title}</Text>
              <Hr style={thinDivider} />

              <DetailRow label="Date" value={dateLabel} />
              <DetailRow label="Time" value={timeLabel} />
              <DetailRow label="Location" value={workshop.location} />
            </Section>

            {/* Order summary */}
            <Section style={summaryCard}>
              <Text style={cardLabel}>Order Summary</Text>
              <Row>
                <Column>
                  <Text style={summaryLeft}>
                    {seats} seat{seats > 1 ? "s" : ""} × ${workshop.price.toFixed(2)}
                  </Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={summaryLeft}>${subtotal.toFixed(2)}</Text>
                </Column>
              </Row>
              {taxLines.map((line) => (
                <Row key={line.type}>
                  <Column>
                    <Text style={summaryLeft}>
                      {line.type} ({(line.rateMicros / 10_000).toFixed(3).replace(/\.?0+$/, "")}%)
                    </Text>
                  </Column>
                  <Column style={{ textAlign: "right" }}>
                    <Text style={summaryLeft}>
                      ${(line.amountCents / 100).toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
              {taxAmount > 0 && <Hr style={thinDivider} />}
              <Row>
                <Column>
                  <Text style={summaryLeft}>Total</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={summaryTotal}>${totalPrice.toFixed(2)}</Text>
                </Column>
              </Row>
              {receiptUrl && (
                <Link href={receiptUrl} style={receiptLink}>
                  View Square Receipt →
                </Link>
              )}
            </Section>

            <Hr style={divider} />
          </Section>
          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerNote}>
              Need to cancel your booking? Send us an email at{" "}
              <Link href={`mailto:${supportEmail}`} style={supportLink}>
                {supportEmail}
              </Link>{" "}
              and our team will assist you.
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

export default WorkshopConfirmationEmail;
