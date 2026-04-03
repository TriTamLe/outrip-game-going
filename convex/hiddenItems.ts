import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import {
  createIdleGlobalStatus,
  getStoredGlobalStatus,
  upsertGlobalStatus,
} from './globalStatus'

const hiddenItemInputValidator = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  score: v.number(),
  isFound: v.boolean(),
})

export const list = query({
  handler: async (ctx) => {
    const items = await ctx.db.query('hiddenItems').withIndex('by_order').collect()

    return items.map((item) => ({
      ...item,
      isFound: item.isFound ?? false,
    }))
  },
})

export const create = mutation({
  args: hiddenItemInputValidator,
  handler: async (ctx, { name, description, score, isFound }) => {
    const normalizedName = name.trim()
    const normalizedDescription = description?.trim() || undefined

    if (!normalizedName) {
      throw new Error('Name is required.')
    }

    const existing = await ctx.db
      .query('hiddenItems')
      .withIndex('by_name', (q) => q.eq('name', normalizedName))
      .unique()

    if (existing) {
      throw new Error('This hidden item already exists.')
    }

    const lastItem = await ctx.db
      .query('hiddenItems')
      .withIndex('by_order')
      .order('desc')
      .first()

    return await ctx.db.insert('hiddenItems', {
      name: normalizedName,
      description: normalizedDescription,
      score,
      isFound,
      order: (lastItem?.order ?? -1) + 1,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('hiddenItems'),
    ...hiddenItemInputValidator.fields,
  },
  handler: async (ctx, { id, name, description, score, isFound }) => {
    const normalizedName = name.trim()
    const normalizedDescription = description?.trim() || undefined

    if (!normalizedName) {
      throw new Error('Name is required.')
    }

    const existing = await ctx.db.get(id)

    if (!existing) {
      throw new Error('Hidden item not found.')
    }

    const duplicate = await ctx.db
      .query('hiddenItems')
      .withIndex('by_name', (q) => q.eq('name', normalizedName))
      .unique()

    if (duplicate && duplicate._id !== id) {
      throw new Error('Another hidden item already uses this name.')
    }

    await ctx.db.patch(id, {
      name: normalizedName,
      description: normalizedDescription,
      score,
      isFound,
    })
  },
})

export const remove = mutation({
  args: {
    id: v.id('hiddenItems'),
  },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)

    if (!existing) {
      return
    }

    await ctx.db.delete(id)
  },
})

export const getGameState = query({
  handler: async (ctx) => {
    const items = (await ctx.db
      .query('hiddenItems')
      .withIndex('by_order')
      .collect()).map((item) => ({
      ...item,
      isFound: item.isFound ?? false,
    }))

    return {
      items,
      remainingCount: items.filter((item) => !item.isFound).length,
    }
  },
})

export const toggleFound = mutation({
  args: {
    id: v.id('hiddenItems'),
  },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)

    if (!existing) {
      throw new Error('Hidden item not found.')
    }

    const nextFoundState = !existing.isFound

    await ctx.db.patch(id, {
      isFound: nextFoundState,
    })

    return nextFoundState
  },
})

export const toggleSession = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()

    if (currentStatus.value === 'in-game:kind-hunt') {
      return await upsertGlobalStatus(ctx, createIdleGlobalStatus())
    }

    if (currentStatus.value !== 'idle') {
      throw new Error('Another game or rule is already active.')
    }

    return await upsertGlobalStatus(ctx, {
      value: 'in-game:kind-hunt',
    })
  },
})
