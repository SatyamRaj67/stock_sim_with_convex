"use server";
import { api } from "@/convex/_generated/api";
import { NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import * as z from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  if (!token) {
    return { error: "Missing Token!" };
  }

  const exisitingToken = await fetchQuery(
    api.passwordResetToken.getPasswordResetTokenByToken,
    { token },
  );

  if (!exisitingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(exisitingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await fetchQuery(api.user.getUserByEmail, {
    email: exisitingToken.identifier,
  });

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await fetchMutation(api.user.updateUserById, {
    id: existingUser._id,
    data: {
      password: hashedPassword,
    },
  });

  await fetchMutation(api.passwordResetToken.deletePasswordResetTokenById, {
    id: exisitingToken._id,
  });

  return { success: "Password Updated!" };
};
