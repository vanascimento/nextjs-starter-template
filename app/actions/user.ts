import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  return await prisma.user.findFirst({ where: { email } });
}
