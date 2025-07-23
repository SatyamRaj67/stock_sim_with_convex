import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  // const existingToken = await getTwoFactorTokenByEmail(email);
  const existingToken = await fetchQuery(
    api.twoFactorToken.getTwoFactorTokenByIdentifier,
    { identifier: email },
  );

  if (existingToken) {
    await fetchMutation(api.twoFactorToken.deleteTwoFactorTokenById, {
      id: existingToken._id,
    });
  }

  const twoFactorToken = await fetchMutation(
    api.twoFactorToken.createTwoFactorToken,
    { identifier: email, token, expires: expires.getTime() },
  );

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await fetchQuery(
    api.passwordResetToken.getPasswordResetTokenByIdentifier,
    { identifier: email },
  );

  if (existingToken) {
    await fetchMutation(api.passwordResetToken.deletePasswordResetTokenById, {
      id: existingToken._id,
    });
  }

  const passwordResetToken = await fetchMutation(
    api.passwordResetToken.createPasswordResetToken,
    { identifier: email, token, expires: expires.getTime() },
  );

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await fetchQuery(
    api.verificationToken.getVerificationTokenByEmail,
    { email },
  );

  if (existingToken) {
    await fetchMutation(api.verificationToken.deleteVerificationTokenById, {
      id: existingToken._id,
    });
  }

  const verificationToken = await fetchMutation(
    api.verificationToken.createVerificationToken,
    { identifier: email, token, expires: expires.getTime() },
  );

  return verificationToken;
};
