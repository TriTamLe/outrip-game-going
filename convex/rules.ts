import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const ruleGameValidator = v.union(
  v.literal('posture'),
  v.literal('vienamese'),
  v.literal('async-battle'),
  v.literal('kind-hunt'),
)

export const ruleOrder = [
  'posture',
  'vienamese',
  'async-battle',
  'kind-hunt',
] as const

export type RuleGame = (typeof ruleOrder)[number]

export const ruleLabels = {
  posture: 'Tâm Đầu Ý Hợp',
  vienamese: 'Tiếng Tây Tiếng Ta',
  'async-battle': 'Cuộc đấu Bất đồng bộ',
  'kind-hunt': 'Cuộc đi săn đầy yêu thương',
} as const

const ruleInputValidator = v.object({
  game: ruleGameValidator,
  markdown: v.string(),
})

export const list = query({
  handler: async (ctx) => {
    const rules = await ctx.db.query('rules').withIndex('by_game').collect()
    const ruleByGame = new Map(rules.map((rule) => [rule.game, rule] as const))

    return ruleOrder
      .map((game) => ruleByGame.get(game))
      .filter((rule) => rule !== undefined)
  },
})

export const getByGame = query({
  args: {
    game: ruleGameValidator,
  },
  handler: async (ctx, { game }) => {
    return await ctx.db
      .query('rules')
      .withIndex('by_game', (q) => q.eq('game', game))
      .unique()
  },
})

export const create = mutation({
  args: ruleInputValidator,
  handler: async (ctx, { game, markdown }) => {
    const normalizedMarkdown = markdown.trim()

    if (!normalizedMarkdown) {
      throw new Error('Rule markdown is required.')
    }

    const existing = await ctx.db
      .query('rules')
      .withIndex('by_game', (q) => q.eq('game', game))
      .unique()

    if (existing) {
      throw new Error('A rule for this game already exists.')
    }

    return await ctx.db.insert('rules', {
      game,
      markdown: normalizedMarkdown,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('rules'),
    ...ruleInputValidator.fields,
  },
  handler: async (ctx, { id, game, markdown }) => {
    const normalizedMarkdown = markdown.trim()

    if (!normalizedMarkdown) {
      throw new Error('Rule markdown is required.')
    }

    const existing = await ctx.db.get(id)

    if (!existing) {
      throw new Error('Rule not found.')
    }

    const duplicate = await ctx.db
      .query('rules')
      .withIndex('by_game', (q) => q.eq('game', game))
      .unique()

    if (duplicate && duplicate._id !== id) {
      throw new Error('Another rule already uses this game.')
    }

    await ctx.db.patch(id, {
      game,
      markdown: normalizedMarkdown,
    })
  },
})

export const remove = mutation({
  args: {
    id: v.id('rules'),
  },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)

    if (!existing) {
      return
    }

    await ctx.db.delete(id)
  },
})
