import { v } from "convex/values";
import { query } from "./_generated/server";

export const getAccountByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      const account = await ctx.db
        .query("accounts")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .first();

      return account;
    } catch {
      return null;
    }
  },
});
