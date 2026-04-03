import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const hiddenItemInputValidator = v.object({
  name: v.string(),
  description: v.optional(v.string()),
  score: v.number(),
})

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('hiddenItems').withIndex('by_order').collect()
  },
})

export const create = mutation({
  args: hiddenItemInputValidator,
  handler: async (ctx, { name, description, score }) => {
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
      order: (lastItem?.order ?? -1) + 1,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('hiddenItems'),
    ...hiddenItemInputValidator.fields,
  },
  handler: async (ctx, { id, name, description, score }) => {
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
