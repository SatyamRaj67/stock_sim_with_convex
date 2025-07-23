"use server";

import { api } from "@/convex/_generated/api";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import { fetchQuery } from "convex/nextjs";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Email!" };
  }

  const { email } = validatedFields.data;

  const exisitingUser = await fetchQuery(api.user.getUserByEmail, {
    email,
  });
  if (!exisitingUser) {
    return { error: "Email Not Found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken!.identifier,
    passwordResetToken!.token,
  );

  return { success: "Password Reset Email Sent!" };
};
