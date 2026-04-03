import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from './_generated/server'
import { v } from 'convex/values'
import { ruleGameValidator, type RuleGame } from './rules'
import { teamValidator, type TeamKey } from './team'

export const globalGameValidator = v.union(
  v.literal('in-game:posture'),
  v.literal('in-game:vienamese'),
  v.literal('in-game:kind-hunt'),
  v.literal('rule:posture'),
  v.literal('rule:vienamese'),
  v.literal('rule:async-battle'),
  v.literal('rule:kind-hunt'),
)

export const postureGamePhaseValidator = v.union(
  v.literal('waiting'),
  v.literal('playing'),
  v.literal('result'),
)

export const vienameseGamePhaseValidator = v.union(
  v.literal('waiting'),
  v.literal('playing'),
  v.literal('ending'),
)

export const ruleStatusValidator = v.union(
  v.literal('rule:posture'),
  v.literal('rule:vienamese'),
  v.literal('rule:async-battle'),
  v.literal('rule:kind-hunt'),
)

export const globalStatusValidator = v.union(
  v.object({
    value: v.literal('idle'),
  }),
  v.object({
    value: v.literal('rule:posture'),
  }),
  v.object({
    value: v.literal('rule:vienamese'),
  }),
  v.object({
    value: v.literal('rule:async-battle'),
  }),
  v.object({
    value: v.literal('rule:kind-hunt'),
  }),
  v.object({
    value: v.literal('in-game:posture'),
    phase: postureGamePhaseValidator,
  }),
  v.object({
    value: v.literal('in-game:kind-hunt'),
  }),
  v.object({
    value: v.literal('in-game:vienamese'),
    team: teamValidator,
    phase: vienameseGamePhaseValidator,
  }),
)

export const globalStatusKey = 'global'

export type GlobalGame =
  | 'in-game:posture'
  | 'in-game:vienamese'
  | 'in-game:kind-hunt'
  | 'rule:posture'
  | 'rule:vienamese'
  | 'rule:async-battle'
  | 'rule:kind-hunt'
export type PostureGamePhase = 'waiting' | 'playing' | 'result'
export type VienameseGamePhase = 'waiting' | 'playing' | 'ending'
export type RuleStatusValue =
  | 'rule:posture'
  | 'rule:vienamese'
  | 'rule:async-battle'
  | 'rule:kind-hunt'

export type GlobalStatus =
  | {
      value: 'idle'
    }
  | {
      value: 'rule:posture'
    }
  | {
      value: 'rule:vienamese'
    }
  | {
      value: 'rule:async-battle'
    }
  | {
      value: 'rule:kind-hunt'
    }
  | {
      value: 'in-game:posture'
      phase: PostureGamePhase
    }
  | {
      value: 'in-game:kind-hunt'
    }
  | {
      value: 'in-game:vienamese'
      team: TeamKey
      phase: VienameseGamePhase
    }

export function createIdleGlobalStatus(): GlobalStatus {
  return {
    value: 'idle',
  }
}

export function createRuleGlobalStatus(game: RuleGame): GlobalStatus {
  return {
    value:
      game === 'posture'
        ? 'rule:posture'
        : game === 'vienamese'
          ? 'rule:vienamese'
          : game === 'async-battle'
            ? 'rule:async-battle'
            : 'rule:kind-hunt',
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
    status: v.union(
      v.object({
        value: v.literal('in-game:posture'),
        phase: postureGamePhaseValidator,
      }),
      v.object({
        value: v.literal('in-game:kind-hunt'),
      }),
      v.object({
        value: v.literal('in-game:vienamese'),
        team: teamValidator,
        phase: vienameseGamePhaseValidator,
      }),
    ),
  },
  handler: async (ctx, { status }) => {
    return await upsertGlobalStatus(ctx, status)
  },
})

export const toggleRule = mutation({
  args: {
    game: ruleGameValidator,
  },
  handler: async (ctx, { game }) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    const nextRuleStatus = createRuleGlobalStatus(game)

    if (
      currentStatus.value === 'in-game:posture' ||
      currentStatus.value === 'in-game:vienamese' ||
      currentStatus.value === 'in-game:kind-hunt'
    ) {
      throw new Error('A game is already active.')
    }

    if (currentStatus.value === nextRuleStatus.value) {
      return await upsertGlobalStatus(ctx, createIdleGlobalStatus())
    }

    return await upsertGlobalStatus(ctx, nextRuleStatus)
  },
})

export { getStoredGlobalStatus, upsertGlobalStatus }
