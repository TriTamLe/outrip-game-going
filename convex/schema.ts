import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { globalStatusValidator } from './globalStatus'
import { idiomStatusValidator } from './idiomStatus'

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
  teams: defineTable({
    key: v.string(),
    name: v.string(),
    score: v.number(),
  }).index('by_key', ['key']),
})
