import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from './_generated/server'
import type { Id } from './_generated/dataModel'
import { v } from 'convex/values'
import {
  createIdleGlobalStatus,
  getStoredGlobalStatus,
  upsertGlobalStatus,
} from './globalStatus'

const postureGameKey = 'posture'

async function getStoredPostureGame(ctx: QueryCtx | MutationCtx) {
  return await ctx.db
    .query('postureGame')
    .withIndex('by_key', (q) => q.eq('key', postureGameKey))
    .unique()
}

async function upsertPostureGame(
  ctx: MutationCtx,
  options: {
    activeWordId?: Id<'postureWords'> | null
    showMembersOnPresent?: boolean
  } = {},
) {
  const existing = await getStoredPostureGame(ctx)
  const nextActiveWordId =
    options.activeWordId === undefined
      ? existing?.activeWordId
      : (options.activeWordId ?? undefined)
  const nextShowMembersOnPresent =
    options.showMembersOnPresent === undefined
      ? existing?.showMembersOnPresent
      : options.showMembersOnPresent

  if (existing) {
    await ctx.db.patch(existing._id, {
      activeWordId: nextActiveWordId,
      showMembersOnPresent: nextShowMembersOnPresent,
    })

    return
  }

  await ctx.db.insert('postureGame', {
    key: postureGameKey,
    activeWordId: nextActiveWordId,
    showMembersOnPresent: nextShowMembersOnPresent,
  })
}

export const getState = query({
  handler: async (ctx) => {
    const [storedState, words] = await Promise.all([
      getStoredPostureGame(ctx),
      ctx.db.query('postureWords').withIndex('by_order').collect(),
    ])

    const activeWord = storedState?.activeWordId
      ? await ctx.db.get(storedState.activeWordId)
      : null

    return {
      activeWord,
      activeWordId: activeWord?._id ?? null,
      showMembersOnPresent: storedState?.showMembersOnPresent ?? true,
      words,
    }
  },
})

export const toggleSession = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    const isPostureActive = currentStatus.value === 'in-game:posture'

    if (!isPostureActive && currentStatus.value !== 'idle') {
      throw new Error('Another game is already active.')
    }

    if (isPostureActive) {
      await Promise.all([
        upsertGlobalStatus(ctx, createIdleGlobalStatus()),
        upsertPostureGame(ctx, { activeWordId: null }),
      ])

      return {
        enabled: false,
      }
    }

    await Promise.all([
      upsertGlobalStatus(ctx, {
        value: 'in-game:posture',
        phase: 'waiting',
      }),
      upsertPostureGame(ctx, { activeWordId: null }),
    ])

    return {
      enabled: true,
    }
  },
})

export const setActiveWord = mutation({
  args: {
    id: v.id('postureWords'),
  },
  handler: async (ctx, { id }) => {
    const word = await ctx.db.get(id)

    if (!word) {
      throw new Error('Posture word not found.')
    }

    await Promise.all([
      upsertPostureGame(ctx, { activeWordId: id }),
      upsertGlobalStatus(ctx, {
        value: 'in-game:posture',
        phase: 'playing',
      }),
    ])

    return {
      activeWordId: id,
    }
  },
})

export const clearActiveWord = mutation({
  handler: async (ctx) => {
    await Promise.all([
      upsertPostureGame(ctx, { activeWordId: null }),
      upsertGlobalStatus(ctx, {
        value: 'in-game:posture',
        phase: 'waiting',
      }),
    ])

    return {
      activeWordId: null,
    }
  },
})

export const toggleMembersOnPresent = mutation({
  handler: async (ctx) => {
    const existing = await getStoredPostureGame(ctx)
    const nextValue = !(existing?.showMembersOnPresent ?? true)

    await upsertPostureGame(ctx, {
      showMembersOnPresent: nextValue,
    })

    return {
      showMembersOnPresent: nextValue,
    }
  },
})
