import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLatestPriceHistory = query({
  args: {
    stockId: v.id("stock"),
  },
  handler: async (ctx, { stockId }) => {
    const query = ctx.db
      .query("priceHistory")
      .withIndex("by_stockId", (q) => q.eq("stockId", stockId))
      .order("desc")
      .first();
    return await query;
  },
});

export const getStockHistoryCount = query({
  args: {
    stockId: v.id("stock"),
  },
  handler: async (ctx, { stockId }) => {
    const records = await ctx.db
      .query("priceHistory")
      .withIndex("by_stockId", (q) => q.eq("stockId", stockId))
      .collect();

    return records.length;
  },
});

export const getStockPriceHistory = query({
  args: {
    stockId: v.id("stock"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { stockId, limit }) => {
    const query = ctx.db
      .query("priceHistory")
      .withIndex("by_stockId", (q) => q.eq("stockId", stockId))
      .order("desc");

    if (limit) {
      return await query.take(limit);
    }

    return await query.collect();
  },
});

export const createPriceHistory = mutation({
  args: {
    stockId: v.id("stock"),
    priceData: v.array(
      v.object({
        timestamp: v.number(),
        openPrice: v.number(),
        highPrice: v.number(),
        lowPrice: v.number(),
        closePrice: v.number(),
        volume: v.number(),
      }),
    ),
  },
  handler: async (ctx, { stockId, priceData }) => {
    const priceHistory = priceData.map((data) => {
      ctx.db.insert("priceHistory", {
        stockId,
        ...data,
      });
    });

    await Promise.all(priceHistory);

    return { recordsCreated: priceData.length };
  },
});

export const deletePriceHistory = mutation({
  args: {
    stockId: v.id("stock"),
  },
  handler: async (ctx, { stockId }) => {
    const priceHistory = await ctx.db
      .query("priceHistory")
      .withIndex("by_stockId", (q) => q.eq("stockId", stockId))
      .collect();

    const deletePromises = priceHistory.map((record) =>
      ctx.db.delete(record._id),
    );

    await Promise.all(deletePromises);

    return { recordsDeleted: priceHistory.length };
  },
});
