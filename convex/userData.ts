import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserDataByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      const userData = await ctx.db
        .query("userData")
        .withIndex("by_userId", (q) => q.eq(("userId"), userId))
        .first();
      return userData;
    } catch {
      return null;
    }
  },
});

export const createUserData = mutation({
  args: {
    userId: v.id("users"),
    balance: v.number(),
    portfolioValue: v.number(),
    totalProfit: v.number(),
    totalInvestment: v.number(),
  },
  handler: async (
    ctx,
    { userId, balance, portfolioValue, totalProfit, totalInvestment },
  ) => {
    try {
      const userDataId = await ctx.db.insert("userData", {
        userId,
        balance,
        portfolioValue,
        totalProfit,
        totalInvestment,
      });
      const userData = await ctx.db.get(userDataId);
      return userData;
    } catch {
      return null;
    }
  },
});

export const updateUserDataByUserId = mutation({
  args: {
    userId: v.id("users"),
    data: v.object({
      balance: v.number(),
      portfolioValue: v.number(),
      totalProfit: v.number(),
      totalInvestment: v.number(),
    }),
  },
  handler: async (ctx, { userId, data }) => {
    const userData = await ctx.db
      .query("userData")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (userData) {
      await ctx.db.patch(userData._id, data);
    } else {
      await ctx.db.insert("userData", { userId, ...data });
    }
  },
});
