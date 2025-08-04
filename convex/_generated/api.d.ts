/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as account from "../account.js";
import type * as authAdapter from "../authAdapter.js";
import type * as http from "../http.js";
import type * as passwordResetToken from "../passwordResetToken.js";
import type * as priceHistory from "../priceHistory.js";
import type * as stock from "../stock.js";
import type * as transaction from "../transaction.js";
import type * as twoFactorConfirmation from "../twoFactorConfirmation.js";
import type * as twoFactorToken from "../twoFactorToken.js";
import type * as user from "../user.js";
import type * as userData from "../userData.js";
import type * as verificationToken from "../verificationToken.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  account: typeof account;
  authAdapter: typeof authAdapter;
  http: typeof http;
  passwordResetToken: typeof passwordResetToken;
  priceHistory: typeof priceHistory;
  stock: typeof stock;
  transaction: typeof transaction;
  twoFactorConfirmation: typeof twoFactorConfirmation;
  twoFactorToken: typeof twoFactorToken;
  user: typeof user;
  userData: typeof userData;
  verificationToken: typeof verificationToken;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
