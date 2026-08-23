import type { AnnouncementEmailProps } from "@/types/subscriber";
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
  Img,
  Link,
  Preview,
} from "@react-email/components";
import {
  body,
  bodyContainer,
  cardLabel,
  container,
  ctaButton,
  ctaSection,
  description as descriptionStyle,
  detailLabel,
  detailValue,
  detailsCard,
  divider,
  footerCopy,
  footerNote,
  footerSection,
  goldBar,
  header,
  heading,
  heroImage,
  itemTitle,
  priceCard,
  priceLabel,
  priceValue,
  subheading,
  thinDivider,
} from "./css";

type PropsType = AnnouncementEmailProps & { supportEmail: string };

/**
 * Announcement sent to the notify-me list when the admin publishes something
 * new. One template, two shapes: a workshop carries date/time/location rows,
 * a product carries a hero image instead.
 */
const AnnouncementEmail = ({
  type,
  title,
  description,
  price,
  ctaUrl,
  dateLabel,
  timeLabel,
  location,
  imageUrl,
  supportEmail,
}: PropsType) => {
  const isWorkshop = type === "workshop";

  const detailRows = isWorkshop
    ? [
        { label: "Date", value: dateLabel },
        { label: "Time", value: timeLabel },
        { label: "Location", value: location },
      ].filter((row): row is { label: string; value: string } =>
        Boolean(row.value),
      )
    : [];

  return (
    <Html>
      <Head />
      <Preview>
        {isWorkshop ? "New workshop: " : "New in the shop: "}
        {title}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={goldBar} />

          <Section style={header}>
            <Heading style={heading}>
              {isWorkshop ? "A New Workshop" : "New in the Shop"}
            </Heading>
            <Text style={subheading}>
              {isWorkshop
                ? "You asked to hear when the next one opened"
                : "You asked to hear when new pieces landed"}
            </Text>
          </Section>

          <Section style={bodyContainer}>
            {!isWorkshop && imageUrl ? (
              <Img src={imageUrl} alt={title} style={heroImage} />
            ) : null}

            <Section style={detailsCard}>
              <Text style={cardLabel}>
                {isWorkshop ? "Workshop" : "Artwork"}
              </Text>
              <Text style={itemTitle}>{title}</Text>

              {description ? (
                <Text style={descriptionStyle}>{description}</Text>
              ) : null}

              {detailRows.length > 0 ? (
                <>
                  <Hr style={thinDivider} />
                  {detailRows.map((row) => (
                    <Row key={row.label} style={{ marginBottom: "10px" }}>
                      <Column style={{ width: "35%" }}>
                        <Text style={detailLabel}>{row.label}</Text>
                      </Column>
                      <Column style={{ width: "65%", textAlign: "right" }}>
                        <Text style={detailValue}>{row.value}</Text>
                      </Column>
                    </Row>
                  ))}
                </>
              ) : null}
            </Section>

            <Section style={priceCard}>
              <Row>
                <Column>
                  <Text style={priceLabel}>
                    {isWorkshop ? "Per seat" : "Price"}
                  </Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={priceValue}>{price}</Text>
                </Column>
              </Row>
            </Section>

            <Section style={ctaSection}>
              <Link href={ctaUrl} style={ctaButton}>
                {isWorkshop ? "Book a Seat" : "View in Shop"}
              </Link>
            </Section>

            <Hr style={divider} />
          </Section>

          <Section style={footerSection}>
            <Text style={footerNote}>
              You are receiving this because you signed up to be notified about
              new {isWorkshop ? "workshops" : "products"}. Questions? Reply to
              this email or reach us at {supportEmail}.
            </Text>
            <Text style={footerCopy}>Resin Art by Tanvi · Calgary, AB</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AnnouncementEmail;
