"use server";

import { api } from "@/convex/_generated/api";
import { currentUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import * as z from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await fetchQuery(api.user.getUserById, {
    id: user.id,
  });

  if (!dbUser) {
    return { error: "Unathorized" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await fetchQuery(api.user.getUserByEmail, {
      email: values.email,
    });

    if (existingUser && existingUser._id !== user.id) {
      return { error: "Email already in use!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken!.identifier,
      verificationToken!.token,
    );

    return { success: "Verification Email Sent!" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Invalid Password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await fetchMutation(api.user.updateUserById, {
    id: user.id,
    data: {
      ...values,
    },
  });

  return { success: "Settings Updated!" };
};
