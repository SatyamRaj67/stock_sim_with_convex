import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getStockBySymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, { symbol }) => {
    try {
      const stock = await ctx.db
        .query("stock")
        .withIndex("by_symbol", (q) => q.eq("symbol", symbol))
        .first();
      return stock;
    } catch (error) {
      console.error("Error fetching stock by symbol:", error);
      throw new Error("Failed to fetch stock");
    }
  },
});

export const getAllStocks = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
    sectorFilter: v.optional(v.string()),
    sortField: v.optional(
      v.union(
        v.literal("symbol"),
        v.literal("name"),
        v.literal("currentPrice"),
        v.literal("openPrice"),
        v.literal("previousClosePrice"),
        v.literal("marketCap"),
        v.literal("volume"),
      ),
    ),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (
    ctx,
    { paginationOpts, searchQuery, sectorFilter, sortField, sortDirection },
  ) => {
    if (searchQuery) {
      const searchIndex =
        searchQuery.length > 4 ? "search_name" : "search_symbol";
      const searchField = searchIndex === "search_name" ? "name" : "symbol";

      let query = ctx.db
        .query("stock")
        .withSearchIndex(searchIndex, (q) =>
          q.search(searchField, searchQuery),
        );

        if (sectorFilter) {
            query = query.filter((q) => q.eq(q.field("sector"), sectorFilter));
        }

        return await query.paginate(paginationOpts);
    }

    let query

    if (sectorFilter) {
          query = ctx.db
        .query("stock")
        .withIndex("by_sector", (q) => q.eq("sector", sectorFilter));
    } else {
        query = ctx.db.query("stock");
    }

    if (sortDirection) {
        query = query.order(sortDirection);
    }

    return await query.paginate(paginationOpts);
  },
});

export const createStock = mutation({
  args: {
    symbol: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    sector: v.optional(v.string()),

    currentPrice: v.number(),
    openPrice: v.optional(v.number()),
    highPrice: v.optional(v.number()),
    lowPrice: v.optional(v.number()),
    previousClosePrice: v.optional(v.number()),

    volume: v.optional(v.number()),
    marketCap: v.optional(v.number()),

    isActive: v.boolean(),
    isFrozen: v.boolean(),

    createdBy: v.id("users"),

    changeFrequency: v.optional(v.number()),
    changeProbability: v.optional(v.number()),
    changeMultiplier: v.optional(v.number()),
  },
  handler: async (
    ctx,
    {
      symbol,
      name,
      description,
      logoUrl,
      sector,
      currentPrice,
      openPrice,
      previousClosePrice,
      volume,
      marketCap,
      isActive,
      isFrozen,
      createdBy,
      changeFrequency,
      changeProbability,
      changeMultiplier,
    },
  ) => {
    const existingStock = await ctx.db
      .query("stock")
      .withIndex("by_symbol", (q) => q.eq("symbol", symbol))
      .first();

    if (existingStock !== null) {
      throw new Error("Stock with this symbol already exists");
    }

    try {
      const stockId = await ctx.db.insert("stock", {
        symbol,
        name,
        description,
        logoUrl,
        sector,
        currentPrice,
        openPrice,
        previousClosePrice,
        volume,
        marketCap,
        isActive,
        isFrozen,
        createdBy,
        changeFrequency,
        changeProbability,
        changeMultiplier,
      });

      const stock = await ctx.db.get(stockId);
      return stock;
    } catch {
      return null;
    }
  },
});

export const updateStockById = mutation({
  args: {
    id: v.id("stock"),
    data: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      sector: v.optional(v.string()),
      currentPrice: v.optional(v.number()),
      openPrice: v.optional(v.number()),
      highPrice: v.optional(v.number()),
      lowPrice: v.optional(v.number()),
      previousClosePrice: v.optional(v.number()),
      volume: v.optional(v.number()),
      marketCap: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
      isFrozen: v.optional(v.boolean()),
      changeFrequency: v.optional(v.number()),
      changeProbability: v.optional(v.number()),
      changeMultiplier: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    try {
      await ctx.db.patch(id, data);
      return await ctx.db.get(id);
    } catch (error) {
      return null;
    }
  },
});
