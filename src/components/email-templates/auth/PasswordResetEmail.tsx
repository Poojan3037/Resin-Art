import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Preview,
} from "@react-email/components";
import {
  body,
  bodyContainer,
  button,
  buttonWrapper,
  card,
  container,
  fallbackLink,
  footer,
  footerCopy,
  goldBar,
  header,
  heading,
  subheading,
  value,
} from "./css";

type PropsType = {
  name: string;
  resetUrl: string;
};

const PasswordResetEmail = ({ name, resetUrl }: PropsType) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={goldBar} />

          <Section style={header}>
            <Heading style={heading}>Reset Your Password</Heading>
            <Text style={subheading}>Resin Art by Tanvi</Text>
          </Section>

          <Section style={bodyContainer}>
            <Section style={card}>
              <Text style={value}>Hi {name},</Text>
              <Text style={value}>
                We received a request to reset your password. This link
                expires in 60 minutes and can only be used once.
              </Text>

              <Section style={buttonWrapper}>
                <Link href={resetUrl} style={button}>
                  Reset Password
                </Link>
              </Section>

              <Text style={value}>
                If the button above doesn&apos;t work, copy and paste this
                link into your browser:
              </Text>
              <Text style={fallbackLink}>{resetUrl}</Text>

              <Text style={value}>
                If you didn&apos;t request this, you can safely ignore this
                email — your password will not change.
              </Text>
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

export default PasswordResetEmail;
