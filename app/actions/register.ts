"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/schemas/auth";
import { findUserByEmail } from "./user";
import moment from "moment";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "./emails";
import { signIn } from "@/auth";

/**
 * Verifies the token for the provided email.
 *
 * @param email - The email to verify.
 * @param token - The token to verify.
 * @returns An object with either an error message or a success message.
 */
export const verifyTokenForEmail = async (email: string, token: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const verificationToken = await prisma.verificationToken.findFirst({
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

  await prisma.$transaction(async (tx) => {
    await tx.verificationToken.update({
      where: {
        identifier: "VERIFY_EMAIL",
        token: token,
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
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);

  console.log(validateFields);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists!");
  }

  await prisma.$transaction(async (tx) => {
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
        token: `${gerarNumeroSeisDigitos()}`,
        expires: moment().add(1, "hour").toDate(),
        identifier: "VERIFY_EMAIL",
      },
    });

    await sendVerificationEmail(email, token.token);
  });

  //const verificationToken = await generateVerificationToken(email);

  //await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "User created" };
};

export async function generateNewVerificationToken(email: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const now = new Date();

  const existingVerificationToken = await prisma.verificationToken.findFirst({
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
    await prisma.verificationToken.delete({
      where: {
        userId: user.id,
        verified: false,
        identifier: "VERIFY_EMAIL",
      },
    });
  }

  const token = await prisma.verificationToken.create({
    data: {
      userId: user.id,
      token: `${gerarNumeroSeisDigitos()}`,
      expires: moment().add(1, "hour").toDate(),
      identifier: "VERIFY_EMAIL",
    },
  });

  await sendVerificationEmail(email, token.token);
}

function gerarNumeroSeisDigitos() {
  return Math.floor(100000 + Math.random() * 900000);
}
