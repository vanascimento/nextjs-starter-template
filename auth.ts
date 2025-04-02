import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, User } from "next-auth";
import credentials from "next-auth/providers/credentials";
import email from "next-auth/providers/email";
import { signInSchema } from "./lib/zod";
import { logger } from "./lib/logger";
import { GetUserByEmail } from "./app/actions/user";
import { db } from "./lib/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string;
      emailVerified: boolean;
      name: string;
      darkMode: boolean;
      language: "EN" | "PT_BR";
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
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    newUser: "/register",
  },
  // callbacks: {
  //   authorized: async ({ auth, request }) => {
  //     return !!auth;
  //   },
  // },
  providers: [
    credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        log.debug(credentials, "entering in authorize function");

        const { email, password } = credentials;

        let user = await GetUserByEmail(String(email));
        if (!user) {
          return null;
        }

        if (!user.emailVerified) {
          return null;
        }

        const passwordMatch = await bcrypt.compareSync(
          String(password),
          user.password
        );
        if (!passwordMatch) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      let user = await GetUserByEmail(String(token.email));
      if (!user) {
        return session;
      }

      session.user.name = user.name || "";
      session.user.darkMode = user.darkMode || false;
      session.user.language = user.language || "EN";
      return session;
    },
  },
});
