import { defineSchema, defineTable } from "convex/server";
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
  users: defineTable(userSchema).index("email", ["email"]),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index(
    "identifierToken",
    ["identifier", "token"],
  ),
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

export default defineSchema({
  ...authTables,
});
