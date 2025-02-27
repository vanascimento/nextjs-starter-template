"use server";
import { signIn, signOut } from "@/auth";
import { findUserByEmail } from "./user";
import { logger } from "@/lib/logger";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const log = logger.child({ module: "login" });
export const logginAction = async (email: string, password: string) => {
  log.info("Logging in user", { email });
  let user = await findUserByEmail(email);
  if (!user) {
    log.error({ email }, "User not found");
    throw new Error("User not found");
  }
  log.info("User found", { email });

  // if (!user.emailVerified) {
  //   log.error({ email }, "Email not verified");
  //   throw new Error(
  //     "Email not verified, check your email for the verification link"
  //   );
  // }

  log.info({ email }, "Signing in user");
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    log.error({ email }, "Error signing in user. Check your credentials");
    throw new Error("Error signing in user. Check your credentials");
  }
};

export const signOutAction = async () => {
  log.info("Signing out user");
  await signOut();
};
