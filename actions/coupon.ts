"use server";

import type { CouponSchema } from "@/components/forms/billing-form";
import { api } from "@/convex/_generated/api";
import { auth } from "@/server/auth";
import { UserRole } from "@/types";
import { fetchMutation } from "convex/nextjs";
import type z from "zod";

export const coupon = async (values: z.infer<typeof CouponSchema>) => {
  if (!values.code) {
    return { error: "Coupon code is required" };
  }

  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  if (values.code === "ANANYA") {
    fetchMutation(api.user.updateUserById, {
      id: session.user.id,
      data: { role: UserRole.ADMIN },
    });

    return { success: "Admin Mode Enabled!!" };
  }

  if (values.code === "USER") {
    fetchMutation(api.user.updateUserById, {
      id: session.user.id,
      data: { role: UserRole.USER },
    });

    return { success: "User Mode Enabled!!" };
  }
  if (values.code === "ADITI") {
    fetchMutation(api.userData.updateUserDataByUserId, {
      userId: session.user.id,
      data: {
        balance: 100000,
        portfolioValue: 100000,
        totalProfit: 0,
        totalInvestment: 0,
      },
    });

    return { success: "Aditi Mode Enabled!!" };
  }
};
