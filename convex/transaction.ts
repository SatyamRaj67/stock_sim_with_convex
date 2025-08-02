import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllTransactionsByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    try {
      const transactions = await ctx.db
        .query("transaction")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();

      return transactions;
    } catch {
      return null;
    }
  },
});

export const createTransactionByUserId = mutation({
  args: {
    userId: v.id("users"),
    stockId: v.id("stock"),
    type: v.union(v.literal("BUY"), v.literal("SELL")),
    quantity: v.number(),
    pricePerStock: v.number(),
    amount: v.number(),
  },
  handler: async (
    ctx,
    { userId, stockId, type, quantity, pricePerStock, amount },
  ) => {
    try {
      const transactionId = await ctx.db.insert("transaction", {
        userId,
        stockId,
        type,
        quantity,
        pricePerStock,
        amount,
      });
      const transaction = await ctx.db.get(transactionId);
      return transaction;
    } catch {
      return null;
    }
  },
});
