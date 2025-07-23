import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getVerificationTokenByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    try {
      const verificationToken = await ctx.db
        .query("verificationTokens")
        .filter((q) => q.eq(q.field("identifier"), email))
        .first();
      return verificationToken;
    } catch {
      return null;
    }
  },
});

export const getVerificationTokenByToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      const verificationToken = await ctx.db
        .query("verificationTokens")
        .filter((q) => q.eq(q.field("token"), token))
        .unique();
      return verificationToken;
    } catch {
      return null;
    }
  },
});

export const createVerificationToken = mutation({
  args: {
    identifier: v.string(), 
    token: v.string(),
    expires: v.number(), 
  },
  handler: async (ctx, { identifier, token, expires }) => {
    try {
      const tokenId = await ctx.db.insert("verificationTokens", {
        identifier,
        token,
        expires,
      });
      const verificationToken = await ctx.db.get(tokenId);
      return verificationToken;
    } catch {
      return null;
    }
  },
});

export const deleteVerificationTokenById = mutation({
  args: { id: v.id("verificationTokens") },
  handler: async (ctx, { id }) => {
    try {
      const verificationToken = await ctx.db.get(id);
      await ctx.db.delete(id);
      return verificationToken;
    } catch {
      return null;
    }
  },
});
