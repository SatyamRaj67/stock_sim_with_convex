import { defineSchema, defineTable, SearchFilter } from "convex/server";
import { type Validator, v } from "convex/values";

// The users, accounts, sessions and verificationTokens tables are modeled
// from https://authjs.dev/getting-started/adapters#models

export const userSchema = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  image: v.optional(v.string()),
  password: v.optional(v.string()),

  role: v.optional(v.string()),
  isTwoFactorEnabled: v.optional(v.boolean()),
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.union(
    v.literal("email"),
    v.literal("oidc"),
    v.literal("oauth"),
    v.literal("webauthn"),
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string() as Validator<Lowercase<string>>),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
};

export const authenticatorSchema = {
  credentialID: v.string(),
  userId: v.id("users"),
  providerAccountId: v.string(),
  credentialPublicKey: v.string(),
  counter: v.number(),
  credentialDeviceType: v.string(),
  credentialBackedUp: v.boolean(),
  transports: v.optional(v.string()),
};

export const twoFactorConfirmationSchema = {
  userId: v.id("users"),
};

export const twoFactorTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const passwordResetTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

const authTables = {
  users: defineTable(userSchema)
    .index("email", ["email"])
    .index("by_role", ["role"])
    .index("by_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["role"],
    })
    .searchIndex("search_email", {
      searchField: "email",
      filterFields: ["role"],
    }),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema)
    .index("identifierToken", ["identifier", "token"])
    .index("token", ["token"])
    .index("identifier", ["identifier"]),
  authenticators: defineTable(authenticatorSchema)
    .index("userId", ["userId"])
    .index("credentialID", ["credentialID"]),
  twoFactorConfirmations: defineTable(twoFactorConfirmationSchema).index(
    "userId",
    ["userId"],
  ),
  twoFactorTokens: defineTable(twoFactorTokenSchema)
    .index("token", ["token"])
    .index("identifier", ["identifier"]),
  passwordResetTokens: defineTable(passwordResetTokenSchema)
    .index("token", ["token"])
    .index("identifier", ["identifier"]),
};

export const AppTables = {
  userData: defineTable({
    userId: v.id("users"),
    balance: v.number(),
    portfolioValue: v.number(),
    totalProfit: v.number(),
    totalInvestment: v.number(),
  }).index("by_userId", ["userId"]),

  portfolio: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),

  position: defineTable({
    portfolioId: v.id("portfolio"),
    stockId: v.id("stock"),
    quantity: v.number(),
    averagePrice: v.number(),
    currentPrice: v.number(),

    profitLoss: v.optional(v.number()),
  })
    .index("by_portfolioId", ["portfolioId"])
    .index("by_stockId", ["stockId"]),

  transaction: defineTable({
    userId: v.id("users"),
    stockId: v.id("stock"),
    type: v.union(v.literal("BUY"), v.literal("SELL")),
    quantity: v.number(),
    pricePerStock: v.number(),
    amount: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stockId", ["stockId"])
    .index("by_type", ["type"]),

  watchlist: defineTable({
    userId: v.id("users"),
    stockId: v.id("stock"),
  })
    .index("by_userId", ["userId"])
    .index("by_stockId", ["stockId"]),

  adminWatchlist: defineTable({
    userId: v.id("users"),
    issueType: v.string(),
    issueSeverity: v.optional(v.string()),
    description: v.optional(v.string()),
    resolved: v.boolean(),
    createdBy: v.id("users"),
  }),

  stock: defineTable({
    symbol: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    sector: v.optional(v.string()),

    currentPrice: v.number(),
    openPrice: v.optional(v.number()),
    previousClosePrice: v.optional(v.number()),

    volume: v.optional(v.number()),
    marketCap: v.optional(v.number()),

    isActive: v.boolean(),
    isFrozen: v.boolean(),

    createdBy: v.id("users"),

    changeFrequency: v.optional(v.number()),
    changeProbability: v.optional(v.number()),
    changeMultiplier: v.optional(v.number()),
  })
    .index("by_symbol", ["symbol"])
    .index("by_sector", ["sector"])
    .searchIndex("search_symbol", {
      searchField: "symbol",
      filterFields: ["sector"],
    })
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["sector"],
    }),

  priceHistory: defineTable({
    stockId: v.id("stock"),
    timestamp: v.number(),
    openPrice: v.number(),
    highPrice: v.optional(v.number()),
    lowPrice: v.optional(v.number()),
    closePrice: v.optional(v.number()),
    volume: v.number(),
  })
    .index("by_stockId", ["stockId"])
    .index("by_timestamp", ["timestamp"]),
};

export default defineSchema({
  ...authTables,
  ...AppTables,
});
