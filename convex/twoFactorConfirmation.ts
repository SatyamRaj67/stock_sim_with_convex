import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTwoFactorConfirmationByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      const twoFactorConfirmation = await ctx.db
        .query("twoFactorConfirmations")
        .filter((q) => q.eq(q.field("userId"), userId))
        .unique();
      return twoFactorConfirmation;
    } catch {
      return null;
    }
  },
});

export const createTwoFactorConfirmationByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      const confirmationId = await ctx.db.insert("twoFactorConfirmations", {
        userId,
      });
      const twoFactorConfirmation = await ctx.db.get(confirmationId);
      return twoFactorConfirmation;
    } catch {
      return null;
    }
  },
});

export const deleteTwoFactorConfirmationById = mutation({
  args: { id: v.id("twoFactorConfirmations") },
  handler: async (ctx, { id }) => {
    try {
      const twoFactorConfirmation = await ctx.db.get(id);
      await ctx.db.delete(id);
      return twoFactorConfirmation;
    } catch {
      return null;
    }
  },
});

export const deleteTwoFactorConfirmationByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      const twoFactorConfirmation = await ctx.db
        .query("twoFactorConfirmations")
        .filter((q) => q.eq(q.field("userId"), userId))
        .unique();

      if (twoFactorConfirmation) {
        await ctx.db.delete(twoFactorConfirmation._id);
        return twoFactorConfirmation;
      }
      return null;
    } catch {
      return null;
    }
  },
});
