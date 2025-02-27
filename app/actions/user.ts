"use server";
import { logger } from "@/lib/logger";
import { db } from "@/lib/prisma";

const log = logger.child({ module: "user" });
export async function findUserByEmail(email: string) {
  log.info({ email }, "Finding user by email");
  try {
    return await db.user.findUnique({ where: { email } });
  } catch (e) {
    log.error({ email }, "Error finding user by email");
    return null;
  }
}
