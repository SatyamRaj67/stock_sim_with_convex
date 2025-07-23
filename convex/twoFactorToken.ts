import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTwoFactorTokenByToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      const twoFactorToken = await ctx.db
        .query("twoFactorTokens")
        .filter((q) => q.eq(q.field("token"), token))
        .unique();
      return twoFactorToken;
    } catch {
      return null;
    }
  },
});

export const getTwoFactorTokenByIdentifier = query({
  args: { identifier: v.string() },
  handler: async (ctx, { identifier }) => {
    try {
      const twoFactorToken = await ctx.db
        .query("twoFactorTokens")
        .filter((q) => q.eq(q.field("identifier"), identifier))
        .first();
      return twoFactorToken;
    } catch {
      return null;
    }
  },
});

export const createTwoFactorToken = mutation({
  args: {
    identifier: v.string(),
    token: v.string(),
    expires: v.number(), 
  },
  handler: async (ctx, { identifier, token, expires }) => {
    try {
      const tokenId = await ctx.db.insert("twoFactorTokens", {
        identifier,
        token,
        expires,
      });
      const twoFactorToken = await ctx.db.get(tokenId);
      return twoFactorToken;
    } catch {
      return null;
    }
  },
});

export const deleteTwoFactorTokenById = mutation({
  args: { id: v.id("twoFactorTokens") },
  handler: async (ctx, { id }) => {
    try {
      const twoFactorToken = await ctx.db.get(id);
      await ctx.db.delete(id);
      return twoFactorToken;
    } catch {
      return null;
    }
  },
});
