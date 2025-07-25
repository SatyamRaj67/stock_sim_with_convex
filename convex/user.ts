import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { UserRole } from "../types";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    return user;
  }
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .unique();
      return user;
    } catch {
      return null;
    }
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    try {
      const user = await ctx.db.get(id);
      return user;
    } catch {
      return null;
    }
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { name, email, password }) => {
    try {
      const userId = await ctx.db.insert("users", {
        name,
        email,
        password,
        balance: 10000,
        role: UserRole.USER,
      });
      const user = await ctx.db.get(userId);
      return user;
    } catch {
      return null;
    }
  },
});

export const updateUserById = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      password: v.optional(v.string()),
      emailVerified: v.optional(v.number()),
      role: v.optional(v.string()),
      isTwoFactorEnabled: v.optional(v.boolean()),

      balance: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    try {
      await ctx.db.patch(id, data);
      const user = await ctx.db.get(id);
      return user;
    } catch {
      return null;
    }
  },
});
