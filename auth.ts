import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, User } from "next-auth";
import { prisma } from "./lib/prisma";
import credentials from "next-auth/providers/credentials";
import email from "next-auth/providers/email";
import { signInSchema } from "./lib/zod";
import { logger } from "./lib/logger";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

const log = logger.child({
  module: "auth",
});
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    credentials({
      credentials: {
        email: {},
        papassword: {},
      },
      authorize: async (credentials) => {
        let user: User | null = null;

        log.debug(credentials, "entering in authorize function");

        const { email, password } = await signInSchema.parseAsync(credentials);
        return user;
      },
    }),
  ],
});
