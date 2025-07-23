"use server";

import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";

export const newVerification = async (token: string) => {
  const existingToken = await fetchQuery(
    api.verificationToken.getVerificationTokenByToken,
    { token },
  );

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await fetchQuery(api.user.getUserByEmail, {
    email: existingToken.identifier,
  });

  if (!existingUser) {
    return { error: "User (Email) does not exist!" };
  }

  await fetchMutation(api.user.updateUserById, {
    id: existingUser._id,
    data: {
      emailVerified: Date.now(),
      email: existingToken.identifier,
    },
  });

  await fetchMutation(api.verificationToken.deleteVerificationTokenById, {
    id: existingToken._id,
  });

  return { success: "Email Verified!" };
};
