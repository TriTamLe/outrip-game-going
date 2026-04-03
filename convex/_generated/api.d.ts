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
import type * as hiddenItems from "../hiddenItems.js";
import type * as idiomStatus from "../idiomStatus.js";
import type * as idioms from "../idioms.js";
import type * as postureGame from "../postureGame.js";
import type * as postureWords from "../postureWords.js";
import type * as rules from "../rules.js";
import type * as team from "../team.js";
import type * as teamMembers from "../teamMembers.js";
import type * as teams from "../teams.js";
import type * as vienameseGame from "../vienameseGame.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  globalStatus: typeof globalStatus;
  hiddenItems: typeof hiddenItems;
  idiomStatus: typeof idiomStatus;
  idioms: typeof idioms;
  postureGame: typeof postureGame;
  postureWords: typeof postureWords;
  rules: typeof rules;
  team: typeof team;
  teamMembers: typeof teamMembers;
  teams: typeof teams;
  vienameseGame: typeof vienameseGame;
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
