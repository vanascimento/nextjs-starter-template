"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas/auth";
import { GetUserByEmail } from "./user";
import moment from "moment";
import {
  SendEmailForResetPassword,
  SendEmailToVerificationEmailAddress,
} from "./emails";
import { db } from "@/lib/prisma";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "register" });
/**
 * Verifies the token for the provided email.
 *
 * @param email - The email to verify.
 * @param token - The token to verify.
 * @returns An object with either an error message or a success message.
 */
export const ExecuteTokenVerificationFormEmail = async (
  email: string,
  token: string
) => {
  const user = await GetUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const verificationToken = await db.verificationToken.findFirst({
    where: {
      userId: user.id,
      token: token,
      identifier: "VERIFY_EMAIL",
      expires: {
        gte: new Date(),
      },
    },
  });

  if (!verificationToken) {
    throw new Error("Invalid token");
  }

  if (verificationToken.verified) {
    throw new Error("Token already verified");
  }

  await db.$transaction(async (tx) => {
    await tx.verificationToken.update({
      where: {
        id: verificationToken.id,
      },
      data: {
        verified: true,
      },
    });

    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });
  });

  return { success: "Email verified" };
};
/**
 * Registers a new user with the provided values.
 *
 * @param values - The values for the user registration.
 * @returns An object with either an error message or a success message.
 */
export const CreateNewUserWithEmailVerification = async (
  values: z.infer<typeof RegisterSchema>
) => {
  const validateFields = RegisterSchema.safeParse(values);

  console.log(validateFields);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await GetUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists!");
  }

  await db.$transaction(async (tx) => {
    let user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: false,
      },
    });

    let token = await tx.verificationToken.create({
      data: {
        userId: user.id,
        token: `${_generateSixRandomNumbers()}`,
        expires: moment().add(1, "hour").toDate(),
        identifier: "VERIFY_EMAIL",
      },
    });

    await SendEmailToVerificationEmailAddress(email, token.token);
  });

  //const verificationToken = await generateVerificationToken(email);

  //await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "User created" };
};

/**
 * Verifies the token for the provided email.
 *
 * @param email - The email to verify.
 * @param token - The token to verify.
 * @returns An object with either an error message or a success message.
 */
export async function ExecuteChangePasswordAction(
  email: string,
  password: string,
  token: string
) {
  const user = await GetUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const verificationToken = await db.verificationToken.findFirst({
    where: {
      userId: user.id,
      token: token,
      identifier: "RESET_PASSWORD",
      verified: false,
    },
  });

  if (!verificationToken) {
    log.warn({ email, token }, "Invalid token");
    throw new Error("Invalid token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.$transaction(async (tx) => {
    await tx.verificationToken.update({
      where: {
        id: verificationToken.id,
      },
      data: {
        verified: true,
      },
    });

    await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
  });

  return { success: "Password changed" };
}

/**
 * Creates a token to reset the password.
 *
 * @param email - The email to reset the password.
 */
export async function CreateTokenForResetPassword(email: string) {
  const user = await GetUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();

  const existingVerificationToken = await db.verificationToken.findFirst({
    where: {
      userId: user.id,
      identifier: "RESET_PASSWORD",
      verified: false,
    },
  });

  await db.$transaction(async (tx) => {
    if (existingVerificationToken) {
      await tx.verificationToken.delete({
        where: {
          id: existingVerificationToken.id,
        },
      });
    }

    let token = await tx.verificationToken.create({
      data: {
        userId: user.id,
        token: `${_generateSixRandomNumbers()}`,
        expires: moment().add(1, "hour").toDate(),
        identifier: "RESET_PASSWORD",
      },
    });

    await SendEmailForResetPassword(email, token.token);
  });
}

/**
 * Generates a new verification token.
 *
 * @param email - The email to generate the token.
 */
export async function CreateNewVerificationEmailToken(email: string) {
  const user = await GetUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email already verified");
  }

  const now = new Date();

  const existingVerificationToken = await db.verificationToken.findFirst({
    where: {
      userId: user.id,
      identifier: "VERIFY_EMAIL",
      verified: false,
    },
  });

  if (
    moment(existingVerificationToken?.createdAt).isAfter(
      moment().subtract(10, "minute")
    )
  ) {
    throw new Error("You can only request a new token every 10 minutes");
  }

  if (existingVerificationToken) {
    await db.verificationToken.delete({
      where: {
        id: existingVerificationToken.id,
      },
    });
  }

  const token = await db.verificationToken.create({
    data: {
      userId: user.id,
      token: `${_generateSixRandomNumbers()}`,
      expires: moment().add(1, "hour").toDate(),
      identifier: "VERIFY_EMAIL",
    },
  });

  await SendEmailToVerificationEmailAddress(email, token.token);
}

function _generateSixRandomNumbers() {
  return Math.floor(100000 + Math.random() * 900000);
}
