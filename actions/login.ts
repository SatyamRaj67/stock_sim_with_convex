"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { signIn } from "@/server/auth";

import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await fetchQuery(api.user.getUserByEmail, {
    email,
  });

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken!.identifier,
      verificationToken!.token,
    );

    return { success: "Confirmation Email Sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await fetchQuery(
        api.twoFactorToken.getTwoFactorTokenByIdentifier,
        {
          identifier: existingUser.email,
        },
      );

      if (!twoFactorToken) {
        return { error: "Invalid Code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid Code!" };
      }

      const hasExpired = new Date() > new Date(twoFactorToken.expires);

      if (hasExpired) {
        return { error: "Code has expired!" };
      }

      await fetchMutation(api.twoFactorToken.deleteTwoFactorTokenById, {
        id: twoFactorToken._id,
      });

      const existingConfirmation = await fetchQuery(
        api.twoFactorConfirmation.getTwoFactorConfirmationByUserId,
        { userId: existingUser._id },
      );

      if (existingConfirmation) {
        await fetchMutation(
          api.twoFactorConfirmation.deleteTwoFactorConfirmationById,
          {
            id: existingConfirmation._id,
          },
        );
      }

      await fetchMutation(
        api.twoFactorConfirmation.createTwoFactorConfirmationByUserId,
        { userId: existingUser._id },
      );
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(twoFactorToken!.identifier, twoFactorToken!.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
