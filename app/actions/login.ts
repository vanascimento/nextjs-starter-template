"use server";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "./user";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "login" });
export const logginAction = async (email: string, password: string) => {
  log.info("Logging in user", { email });
  let user = await findUserByEmail(email);
  if (!user) {
    log.error({ email }, "User not found");
    throw new Error("User not found");
  }
  log.info("User found", { email });

  if (!user.emailVerified) {
    log.error({ email }, "Email not verified");
    throw new Error(
      "Email not verified, check your email for the verification link"
    );
  }

  log.info({ email }, "Signing in user");
  //await signIn("credentials", { email, password });
};
