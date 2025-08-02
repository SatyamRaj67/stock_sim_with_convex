import { type DefaultSession, type NextAuthConfig } from "next-auth";
import providers from "./providers";
import type { UserRole } from "@/types";
import { ConvexAdapter } from "./convexAdapter";

import { SignJWT, importPKCS8 } from "jose";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL!.replace(
  /.cloud$/,
  ".site",
);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    convexToken: string;
    user: {
      id: Id<"users">;
      // ...other properties
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await fetchMutation(api.user.updateUserById, {
        id: user.id as Id<"users">,
        data: {
          emailVerified: Date.now(),
        },
      });
    },
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      // Allow OAuth without email verificaion
      if (account?.type !== "credentials") return true;

      if (!user.id) return false;

      const existingUser = await fetchQuery(api.user.getUserById, {
        id: user.id as Id<"users">,
      });

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await fetchQuery(
          api.twoFactorConfirmation.getTwoFactorConfirmationByUserId,
          { userId: existingUser._id },
        );

        if (!twoFactorConfirmation) return false;

        // Delete Two Factor Confirmation for Next SignIn
        await fetchMutation(
          api.twoFactorConfirmation.deleteTwoFactorConfirmationByUserId,
          { userId: existingUser._id },
        );
      }

      return true;
    },
    session: async ({ session, token }) => {
      const privateKey = await importPKCS8(
        process.env.CONVEX_AUTH_PRIVATE_KEY!,
        "RS256",
      );

      const convexToken = await new SignJWT({
        sub: token.sub,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);

      if (token.sub && session.user) {
        session.user.id = token.sub as Id<"users">;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return { ...session, convexToken };
    },
    jwt: async ({ token, user, account }) => {
      if (!token.sub) return token;

      const existingUser = await fetchQuery(api.user.getUserById, {
        id: token.sub as Id<"users">,
      });

      if (!existingUser) return token;

      const existingAccount = await fetchQuery(api.account.getAccountByUserId, {
        userId: existingUser._id,
      });

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: ConvexAdapter as any,
  ...providers,
} satisfies NextAuthConfig;
