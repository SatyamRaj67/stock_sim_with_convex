"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@/types";

export const admin = async () => {
  const role = await currentRole();

  if (role !== UserRole.ADMIN) {
    return { error: "Forbidden Server Action!" };
  }

  return { success: "Allowed Server Action!" };
};
