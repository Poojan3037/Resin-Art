import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components";
import {
  body,
  bodyContainer,
  card,
  container,
  divider,
  footer,
  footerCopy,
  goldBar,
  header,
  heading,
  label,
  messageBox,
  messageText,
  subheading,
  value,
} from "./css";

type PropsType = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};

const ContactInquiryEmail = ({ name, email, message, subject }: PropsType) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        New contact inquiry from {name}
        {subject ? ` — ${subject}` : ""}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={goldBar} />

          <Section style={header}>
            <Heading style={heading}>New Contact Inquiry</Heading>
            <Text style={subheading}>{subject ?? "General Message"}</Text>
          </Section>

          <Section style={bodyContainer}>
            <Section style={card}>
              <Text style={label}>From</Text>
              <Text style={value}>{name}</Text>

              <Hr style={divider} />

              <Text style={label}>Email</Text>
              <Text style={value}>{email}</Text>

              {subject && (
                <>
                  <Hr style={divider} />
                  <Text style={label}>Subject</Text>
                  <Text style={value}>{subject}</Text>
                </>
              )}
            </Section>

            <Section style={messageBox}>
              <Text style={label}>Message</Text>
              <Text style={messageText}>{message}</Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerCopy}>
              Resin Art by Tanvi · hello@resinartbytanvi.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactInquiryEmail;
