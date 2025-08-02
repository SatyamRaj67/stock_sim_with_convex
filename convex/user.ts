import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    return ctx.auth.getUserIdentity();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    try {
      const user = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", email))
        .first();
      return user;
    } catch {
      return null;
    }
  },
});

export const getAllUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
    roleFilter: v.optional(v.string()),
    sortField: v.optional(
      v.union(
        v.literal("name"),
        v.literal("email"),
        v.literal("_creationTime"),
      ),
    ),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (
    ctx,
    { paginationOpts, searchQuery, roleFilter, sortField, sortDirection },
  ) => {
    // 1. Handle Search Query
    if (searchQuery) {
      // Determine which search index to use based on whether the query looks like an email
      const searchIndex = searchQuery.includes("@")
        ? "search_email"
        : "search_name";
      const searchField = searchIndex === "search_email" ? "email" : "name";

      let query = ctx.db
        .query("users")
        .withSearchIndex(searchIndex, (q) =>
          q.search(searchField, searchQuery),
        );

      // With search, you can still use filter fields defined in the schema
      if (roleFilter) {
        query = query.filter((q) => q.eq(q.field("role"), roleFilter));
      }

      return await query.paginate(paginationOpts);
    }

    // 2. Handle Sorting and Filtering (No Search)
    let query;

    // Use an index for optimal filtering and sorting
    if (roleFilter) {
      query = ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", roleFilter));
    } else {
      // If no filter, start with a full table query
      query = ctx.db.query("users");
    }

    if (sortDirection) {
      query = query.order(sortDirection);
    }

    return await query.paginate(paginationOpts);
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
