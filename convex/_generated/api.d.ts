/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as globalStatus from "../globalStatus.js";
import type * as idiomStatus from "../idiomStatus.js";
import type * as idioms from "../idioms.js";
import type * as postureGame from "../postureGame.js";
import type * as postureWords from "../postureWords.js";
import type * as team from "../team.js";
import type * as teams from "../teams.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  globalStatus: typeof globalStatus;
  idiomStatus: typeof idiomStatus;
  idioms: typeof idioms;
  postureGame: typeof postureGame;
  postureWords: typeof postureWords;
  team: typeof team;
  teams: typeof teams;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
