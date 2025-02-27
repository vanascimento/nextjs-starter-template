"use server";
import ResetPasswordEmail from "@/emails/reset-password";
import VerifyTokenEmail from "@/emails/verify-token";
import { logger } from "@/lib/logger";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

const log = logger.child({ module: "emails" });

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: "re_MFwzzDtT_K9VRomi3o2abYw65GqUo6seS",
  },
});

/**
 * Sends an email to verify the email address.
 * @param email email to send the verification email
 * @param token  token to send the verification email
 */
export async function SendEmailToVerificationEmailAddress(
  email: string,
  token: string
) {
  log.info({ email }, "Sending verification email");

  const html = await render(
    <VerifyTokenEmail
      baseUrl="http://localhost:3000"
      email={email}
      token={token}
    />,
    {
      pretty: true,
    }
  );

  log.info({ email }, "Email rendered");

  const info = await transporter.sendMail({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html,
  });

  log.info({ info }, "Email sent");
}

/**
 * Sends an email to reset the password.
 * @param email email to send the reset password email
 * @param token  token to send the reset password email
 */
export async function SendEmailForResetPassword(email: string, token: string) {
  log.info({ email }, "Sending reset password email");

  const html = await render(
    <ResetPasswordEmail
      baseUrl="http://localhost:3000"
      email={email}
      token={token}
    />,
    {
      pretty: true,
    }
  );

  log.info({ email }, "Email rendered");

  const info = await transporter.sendMail({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Change your password",
    html,
  });
  log.info({ info }, "Email sent");
}
