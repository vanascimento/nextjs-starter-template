"use server";
import { signIn, signOut } from "@/auth";
import { GetUserByEmail } from "./user";
import { logger } from "@/lib/logger";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

const log = logger.child({ module: "login" });

/*
 * Initiates the login process for the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 */
export const InitiateLoginProcessAction = async (
  email: string,
  password: string
) => {
  log.info("Logging in user", { email });
  let user = await GetUserByEmail(email);
  if (!user) {
    log.error({ email }, "User not found");
    throw new Error("User not found");
  }
  log.info("User found", { email });

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
