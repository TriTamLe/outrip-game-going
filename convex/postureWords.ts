import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const postureWordInputValidator = v.object({
  english: v.string(),
  vietnamese: v.string(),
})

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('postureWords').withIndex('by_order').collect()
  },
})

export const seed = mutation({
  args: {
    items: v.array(postureWordInputValidator),
  },
  handler: async (ctx, { items }) => {
    let inserted = 0
    let updated = 0

    for (const [order, item] of items.entries()) {
      const english = item.english.trim()
      const vietnamese = item.vietnamese.trim()

      if (!english || !vietnamese) {
        continue
      }

      const existing = await ctx.db
        .query('postureWords')
        .withIndex('by_english', (q) => q.eq('english', english))
        .unique()

      if (existing) {
        if (existing.order !== order || existing.vietnamese !== vietnamese) {
          await ctx.db.patch(existing._id, {
            vietnamese,
            order,
          })
          updated += 1
        }

        continue
      }

      await ctx.db.insert('postureWords', {
        english,
        vietnamese,
        order,
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
  args: postureWordInputValidator,
  handler: async (ctx, { english, vietnamese }) => {
    const normalizedEnglish = english.trim()
    const normalizedVietnamese = vietnamese.trim()

    if (!normalizedEnglish || !normalizedVietnamese) {
      throw new Error('Both English and Vietnamese are required.')
    }

    const existing = await ctx.db
      .query('postureWords')
      .withIndex('by_english', (q) => q.eq('english', normalizedEnglish))
      .unique()

    if (existing) {
      throw new Error('This posture word already exists.')
    }

    const lastItem = await ctx.db
      .query('postureWords')
      .withIndex('by_order')
      .order('desc')
      .first()

    return await ctx.db.insert('postureWords', {
      english: normalizedEnglish,
      vietnamese: normalizedVietnamese,
      order: (lastItem?.order ?? -1) + 1,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('postureWords'),
    english: v.string(),
    vietnamese: v.string(),
  },
  handler: async (ctx, { id, english, vietnamese }) => {
    const normalizedEnglish = english.trim()
    const normalizedVietnamese = vietnamese.trim()

    if (!normalizedEnglish || !normalizedVietnamese) {
      throw new Error('Both English and Vietnamese are required.')
    }

    const existing = await ctx.db.get(id)

    if (!existing) {
      throw new Error('Posture word not found.')
    }

    const duplicate = await ctx.db
      .query('postureWords')
      .withIndex('by_english', (q) => q.eq('english', normalizedEnglish))
      .unique()

    if (duplicate && duplicate._id !== id) {
      throw new Error('Another posture word already uses this English text.')
    }

    await ctx.db.patch(id, {
      english: normalizedEnglish,
      vietnamese: normalizedVietnamese,
    })
  },
})

export const remove = mutation({
  args: {
    id: v.id('postureWords'),
  },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)

    if (!existing) {
      return
    }

    await ctx.db.delete(id)
  },
})
