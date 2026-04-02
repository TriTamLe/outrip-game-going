import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import {
  createDefaultIdiomStatus,
  hasSameIdiomStatus,
  idiomStatusValidator,
  normalizeIdiomStatus,
} from './idiomStatus'

export const list = query({
  handler: async (ctx) => {
    const idioms = await ctx.db.query('idioms').withIndex('by_order').collect()

    return idioms.map((idiom) => ({
      ...idiom,
      status: normalizeIdiomStatus(idiom.status),
    }))
  },
})

export const seed = mutation({
  args: {
    items: v.array(v.string()),
  },
  handler: async (ctx, { items }) => {
    let inserted = 0
    let updated = 0

    for (const [order, text] of items.entries()) {
      const normalizedText = text.trim()

      if (!normalizedText) {
        continue
      }

      const existing = await ctx.db
        .query('idioms')
        .withIndex('by_text', (q) => q.eq('text', normalizedText))
        .unique()

      if (existing) {
        const normalizedStatus = normalizeIdiomStatus(existing.status)
        const shouldUpdate =
          !existing.status ||
          existing.order !== order ||
          !hasSameIdiomStatus(normalizedStatus, createDefaultIdiomStatus())

        if (shouldUpdate) {
          await ctx.db.patch(existing._id, {
            order,
            status: createDefaultIdiomStatus(),
          })
          updated += 1
        }

        continue
      }

      await ctx.db.insert('idioms', {
        text: normalizedText,
        order,
        status: createDefaultIdiomStatus(),
      })
      inserted += 1
    }

    return {
      total: items.length,
      inserted,
      updated,
    }
  },
})

export const create = mutation({
  args: {
    text: v.string(),
    status: idiomStatusValidator,
  },
  handler: async (ctx, { text, status }) => {
    const normalizedText = text.trim()

    if (!normalizedText) {
      throw new Error('Idiom text is required.')
    }

    const existing = await ctx.db
      .query('idioms')
      .withIndex('by_text', (q) => q.eq('text', normalizedText))
      .unique()

    if (existing) {
      throw new Error('This idiom already exists.')
    }

    const lastIdiom = await ctx.db
      .query('idioms')
      .withIndex('by_order')
      .order('desc')
      .first()

    return await ctx.db.insert('idioms', {
      text: normalizedText,
      order: (lastIdiom?.order ?? -1) + 1,
      status,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('idioms'),
    text: v.string(),
    status: idiomStatusValidator,
  },
  handler: async (ctx, { id, text, status }) => {
    const normalizedText = text.trim()

    if (!normalizedText) {
      throw new Error('Idiom text is required.')
    }

    const existing = await ctx.db.get(id)

    if (!existing) {
      throw new Error('Idiom not found.')
    }

    const duplicate = await ctx.db
      .query('idioms')
      .withIndex('by_text', (q) => q.eq('text', normalizedText))
      .unique()

    if (duplicate && duplicate._id !== id) {
      throw new Error('Another idiom already uses this text.')
    }

    await ctx.db.patch(id, {
      text: normalizedText,
      status,
    })
  },
})

export const remove = mutation({
  args: {
    id: v.id('idioms'),
  },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)

    if (!existing) {
      return
    }

    await ctx.db.delete(id)
  },
})

export const backfillStatuses = mutation({
  handler: async (ctx) => {
    const idioms = await ctx.db.query('idioms').collect()
    let updated = 0

    for (const idiom of idioms) {
      const normalizedStatus = normalizeIdiomStatus(idiom.status)

      if (!idiom.status || !hasSameIdiomStatus(idiom.status, normalizedStatus)) {
        await ctx.db.patch(idiom._id, {
          status: normalizedStatus,
        })
        updated += 1
      }
    }

    return {
      total: idioms.length,
      updated,
    }
  },
})
