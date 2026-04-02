import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { globalStatusValidator } from './globalStatus'
import { idiomStatusValidator } from './idiomStatus'
import { ruleGameValidator } from './rules'
import { teamValidator } from './team'

export default defineSchema({
  globalStatus: defineTable({
    key: v.string(),
    current: globalStatusValidator,
  }).index('by_key', ['key']),
  idioms: defineTable({
    text: v.string(),
    order: v.number(),
    status: idiomStatusValidator,
  })
    .index('by_text', ['text'])
    .index('by_order', ['order']),
  rules: defineTable({
    game: ruleGameValidator,
    markdown: v.string(),
  }).index('by_game', ['game']),
  postureWords: defineTable({
    english: v.string(),
    vietnamese: v.string(),
    order: v.number(),
  })
    .index('by_english', ['english'])
    .index('by_order', ['order']),
  postureGame: defineTable({
    key: v.string(),
    activeWordId: v.optional(v.id('postureWords')),
    showMembersOnPresent: v.optional(v.boolean()),
  }).index('by_key', ['key']),
  vienameseGame: defineTable({
    key: v.string(),
    activeTeam: teamValidator,
    phase: v.union(
      v.literal('waiting'),
      v.literal('playing'),
      v.literal('ending'),
    ),
    activeIdiomId: v.optional(v.id('idioms')),
    roundScore: v.number(),
    startedAt: v.optional(v.number()),
    pausedAt: v.optional(v.number()),
    accumulatedPausedMs: v.number(),
    durationMs: v.number(),
  }).index('by_key', ['key']),
  vienameseSettings: defineTable({
    key: v.string(),
    durationMs: v.number(),
  }).index('by_key', ['key']),
  teams: defineTable({
    key: v.string(),
    name: v.string(),
    score: v.number(),
  }).index('by_key', ['key']),
})
