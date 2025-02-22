import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerifyTokenEmailProps {
  token: string;
  baseUrl: string;
  email: string;
}
export const VerifyTokenEmail = ({
  token = "123456",
  baseUrl = "http://localhost:3000",
  email = "email@email.com",
}: VerifyTokenEmailProps) => {
  const URL = `${baseUrl}/auth/verify-email?token=${token}&email=${email}`;
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#007291",
              },
            },
          },
        }}
      >
        <Body style={main} className="self-center justify-center py-[2%]">
          <Preview>Verify your email to access your dashboard</Preview>
          <Container style={container}>
            <Section style={box}>
              <Text className="text-center text-lg text-blue-500">
                VERIFY YOUR EMAIL
              </Text>
              <Hr style={hr} />
              <Text className="text-neutral-500 font-normal text-[16px] text-justify">
                Thanks for submitting your account information. After you verify
                your email, you can access your dashboard. If you not recognize
                this email, please ignore
              </Text>
              <Button
                className="bg-blue-500 w-full rounded-sm text-white p-2 text-center"
                href={URL}
              >
                Click here to verify your email
              </Button>
              <Hr className="bg-neutral-200" />
              <Text className="text-neutral-500 font-normal text-[16px] text-justify">
                If you’re having trouble clicking the button, copy and paste the
                URL below into your web browser:{"  "}
                <Link className="text-blue-500" href={URL}>
                  {URL}
                </Link>
              </Text>
              <Text className="text-muted-foreground w-full  text-center">
                You verification token is:
              </Text>
              <Text className="w-full text-center text-3xl text-blue-500 font-semibold">
                {token}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyTokenEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};
