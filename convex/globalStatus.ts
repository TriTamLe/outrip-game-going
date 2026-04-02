import { mutation, query, type MutationCtx, type QueryCtx } from './_generated/server'
import { v } from 'convex/values'
import { teamValidator, type TeamKey } from './team'

export const globalGameValidator = v.union(
  v.literal('in-game:posture'),
  v.literal('in-game:vienamese'),
)

export const globalGamePhaseValidator = v.union(
  v.literal('waiting'),
  v.literal('playing'),
  v.literal('result'),
)

export const globalStatusValidator = v.union(
  v.object({
    value: v.literal('idle'),
  }),
  v.object({
    value: globalGameValidator,
    team: teamValidator,
    phase: globalGamePhaseValidator,
  }),
)

export const globalStatusKey = 'global'

export type GlobalGame = 'in-game:posture' | 'in-game:vienamese'
export type GlobalGamePhase = 'waiting' | 'playing' | 'result'

export type GlobalStatus =
  | {
      value: 'idle'
    }
  | {
      value: GlobalGame
      team: TeamKey
      phase: GlobalGamePhase
    }

export function createIdleGlobalStatus(): GlobalStatus {
  return {
    value: 'idle',
  }
}

async function getStoredGlobalStatus(ctx: QueryCtx | MutationCtx) {
  return await ctx.db
    .query('globalStatus')
    .withIndex('by_key', (q) => q.eq('key', globalStatusKey))
    .unique()
}

async function upsertGlobalStatus(ctx: MutationCtx, current: GlobalStatus) {
  const existing = await getStoredGlobalStatus(ctx)

  if (existing) {
    await ctx.db.patch(existing._id, { current })
    return current
  }

  await ctx.db.insert('globalStatus', {
    key: globalStatusKey,
    current,
  })

  return current
}

export const get = query({
  handler: async (ctx) => {
    const existing = await getStoredGlobalStatus(ctx)

    return existing?.current ?? createIdleGlobalStatus()
  },
})

export const setIdle = mutation({
  handler: async (ctx) => {
    return await upsertGlobalStatus(ctx, createIdleGlobalStatus())
  },
})

export const setInGame = mutation({
  args: {
    value: globalGameValidator,
    team: teamValidator,
    phase: globalGamePhaseValidator,
  },
  handler: async (ctx, { value, team, phase }) => {
    return await upsertGlobalStatus(ctx, {
      value,
      team,
      phase,
    })
  },
})
