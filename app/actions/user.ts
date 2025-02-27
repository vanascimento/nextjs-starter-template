"use server";
import { logger } from "@/lib/logger";
import { db } from "@/lib/prisma";

const log = logger.child({ module: "user" });

/**
 * Gets a user by their email.
 * @param email The email of the user.
 */
export async function GetUserByEmail(email: string) {
  log.info({ email }, "Finding user by email");
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (e) {
    log.error({ email }, "Error finding user by email");
    return null;
  }
}
