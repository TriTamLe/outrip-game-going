import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from './_generated/server'
import type { Doc, Id } from './_generated/dataModel'
import { v } from 'convex/values'
import {
  createIdleGlobalStatus,
  getStoredGlobalStatus,
  type GlobalStatus,
  upsertGlobalStatus,
} from './globalStatus'
import {
  getIdiomStatusValueForTeam,
  normalizeIdiomStatus,
  setIdiomGuessedByTeam,
  setIdiomStatusValueForTeam,
} from './idiomStatus'
import { teamValidator, type TeamKey } from './team'
import { adjustTeamScore } from './teams'

const vienameseGameKey = 'vienamese'
const vienameseSettingsKey = 'vienamese-settings'
const defaultRoundDurationMs = 5 * 60 * 1000
const minDurationMinutes = 1
const maxDurationMinutes = 60

type VienamesePhase = 'waiting' | 'playing' | 'ending'

type VienameseGameRecord = Doc<'vienameseGame'>
type IdiomRecord = Doc<'idioms'>

async function getStoredVienameseSettings(ctx: QueryCtx | MutationCtx) {
  return await ctx.db
    .query('vienameseSettings')
    .withIndex('by_key', (q) => q.eq('key', vienameseSettingsKey))
    .unique()
}

async function upsertVienameseSettings(ctx: MutationCtx, durationMs: number) {
  const existing = await getStoredVienameseSettings(ctx)

  if (existing) {
    await ctx.db.patch(existing._id, { durationMs })
    return existing._id
  }

  return await ctx.db.insert('vienameseSettings', {
    key: vienameseSettingsKey,
    durationMs,
  })
}

function normalizeDurationMinutes(minutes: number) {
  if (!Number.isFinite(minutes)) {
    return defaultRoundDurationMs / 60_000
  }

  return Math.min(
    Math.max(Math.round(minutes), minDurationMinutes),
    maxDurationMinutes,
  )
}

async function getStoredVienameseGame(ctx: QueryCtx | MutationCtx) {
  return await ctx.db
    .query('vienameseGame')
    .withIndex('by_key', (q) => q.eq('key', vienameseGameKey))
    .unique()
}

async function upsertVienameseGame(
  ctx: MutationCtx,
  state: {
    activeTeam: TeamKey
    phase: VienamesePhase
    activeIdiomId?: Id<'idioms'> | null
    roundScore: number
    startedAt?: number | null
    pausedAt?: number | null
    accumulatedPausedMs: number
    durationMs: number
  },
) {
  const existing = await getStoredVienameseGame(ctx)
  const nextState = {
    key: vienameseGameKey,
    activeTeam: state.activeTeam,
    phase: state.phase,
    activeIdiomId: state.activeIdiomId ?? undefined,
    roundScore: state.roundScore,
    startedAt: state.startedAt ?? undefined,
    pausedAt: state.pausedAt ?? undefined,
    accumulatedPausedMs: state.accumulatedPausedMs,
    durationMs: state.durationMs,
  }

  if (existing) {
    await ctx.db.patch(existing._id, nextState)
    return existing._id
  }

  return await ctx.db.insert('vienameseGame', nextState)
}

async function deleteVienameseGame(ctx: MutationCtx) {
  const existing = await getStoredVienameseGame(ctx)

  if (!existing) {
    return
  }

  await ctx.db.delete(existing._id)
}

function getDurationMsFromSettings(
  settings: Awaited<ReturnType<typeof getStoredVienameseSettings>>,
) {
  return settings?.durationMs ?? defaultRoundDurationMs
}

function calculateRemainingMs(
  state: Pick<
    VienameseGameRecord,
    'durationMs' | 'startedAt' | 'pausedAt' | 'accumulatedPausedMs'
  >,
  now: number,
) {
  if (!state.startedAt) {
    return state.durationMs
  }

  const effectiveNow = state.pausedAt ?? now
  const elapsedMs = effectiveNow - state.startedAt - state.accumulatedPausedMs

  return Math.max(state.durationMs - elapsedMs, 0)
}

async function pickRandomEligibleIdiom(
  ctx: QueryCtx | MutationCtx,
  team: TeamKey,
  excludeIdiomId?: Id<'idioms'>,
) {
  const idioms = await ctx.db.query('idioms').withIndex('by_order').collect()
  const eligibleIdioms = idioms.filter((idiom) => {
    if (excludeIdiomId && idiom._id === excludeIdiomId) {
      return false
    }

    const teamStatus = getIdiomStatusValueForTeam(
      normalizeIdiomStatus(idiom.status),
      team,
    )

    return teamStatus === 'not-displayed' || teamStatus === 'passed'
  })

  if (eligibleIdioms.length === 0) {
    return null
  }

  const index = Math.floor(Math.random() * eligibleIdioms.length)

  return eligibleIdioms[index]
}

async function patchIdiomStatus(
  ctx: MutationCtx,
  idiom: IdiomRecord,
  team: TeamKey,
  nextValue: 'passed' | 'guessed',
) {
  const normalizedStatus = normalizeIdiomStatus(idiom.status)
  const nextStatus =
    nextValue === 'guessed'
      ? setIdiomGuessedByTeam(normalizedStatus, team)
      : setIdiomStatusValueForTeam(normalizedStatus, team, nextValue)

  await ctx.db.patch(idiom._id, {
    status: nextStatus,
  })
}

async function moveVienameseGameToEnding(
  ctx: MutationCtx,
  state: VienameseGameRecord,
) {
  await Promise.all([
    upsertVienameseGame(ctx, {
      activeTeam: state.activeTeam,
      phase: 'ending',
      activeIdiomId: null,
      roundScore: state.roundScore,
      startedAt: state.startedAt ?? null,
      pausedAt: null,
      accumulatedPausedMs: state.accumulatedPausedMs,
      durationMs: state.durationMs,
    }),
    upsertGlobalStatus(ctx, {
      value: 'in-game:vienamese',
      team: state.activeTeam,
      phase: 'ending',
    }),
  ])
}

function assertVienameseStatus(
  currentStatus: GlobalStatus,
): Extract<GlobalStatus, { value: 'in-game:vienamese' }> {
  if (currentStatus.value !== 'in-game:vienamese') {
    throw new Error('Tiếng Tây Tiếng Ta is not active.')
  }

  return currentStatus
}

export const getState = query({
  handler: async (ctx) => {
    const storedState = await getStoredVienameseGame(ctx)
    const activeIdiom = storedState?.activeIdiomId
      ? await ctx.db.get(storedState.activeIdiomId)
      : null

    return {
      activeTeam: storedState?.activeTeam ?? null,
      phase: storedState?.phase ?? null,
      activeIdiom,
      activeIdiomId: activeIdiom?._id ?? null,
      roundScore: storedState?.roundScore ?? 0,
      startedAt: storedState?.startedAt ?? null,
      pausedAt: storedState?.pausedAt ?? null,
      accumulatedPausedMs: storedState?.accumulatedPausedMs ?? 0,
      durationMs: storedState?.durationMs ?? defaultRoundDurationMs,
    }
  },
})

export const getSettings = query({
  handler: async (ctx) => {
    const settings = await getStoredVienameseSettings(ctx)
    const durationMs = getDurationMsFromSettings(settings)

    return {
      durationMs,
      durationMinutes: Math.max(1, Math.round(durationMs / 60_000)),
    }
  },
})

export const setDurationMinutes = mutation({
  args: {
    minutes: v.number(),
  },
  handler: async (ctx, { minutes }) => {
    const normalizedMinutes = normalizeDurationMinutes(minutes)
    const durationMs = normalizedMinutes * 60_000
    const game = await getStoredVienameseGame(ctx)

    await upsertVienameseSettings(ctx, durationMs)

    if (game && game.phase === 'waiting') {
      await upsertVienameseGame(ctx, {
        activeTeam: game.activeTeam,
        phase: game.phase,
        activeIdiomId: game.activeIdiomId ?? null,
        roundScore: game.roundScore,
        startedAt: game.startedAt ?? null,
        pausedAt: game.pausedAt ?? null,
        accumulatedPausedMs: game.accumulatedPausedMs,
        durationMs,
      })
    }

    return {
      durationMs,
      durationMinutes: normalizedMinutes,
    }
  },
})

export const startForTeam = mutation({
  args: {
    team: teamValidator,
  },
  handler: async (ctx, { team }) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    const settings = await getStoredVienameseSettings(ctx)

    if (currentStatus.value !== 'idle') {
      throw new Error('Another game is already active.')
    }

    await Promise.all([
      upsertGlobalStatus(ctx, {
        value: 'in-game:vienamese',
        team,
        phase: 'waiting',
      }),
      upsertVienameseGame(ctx, {
        activeTeam: team,
        phase: 'waiting',
        activeIdiomId: null,
        roundScore: 0,
        startedAt: null,
        pausedAt: null,
        accumulatedPausedMs: 0,
        durationMs: getDurationMsFromSettings(settings),
      }),
    ])

    return {
      team,
      phase: 'waiting' as const,
    }
  },
})

export const beginPlaying = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    const vienameseStatus = assertVienameseStatus(currentStatus)
    const state = await getStoredVienameseGame(ctx)

    if (!state || state.phase !== 'waiting') {
      throw new Error('The round is not waiting to start.')
    }

    const nextIdiom = await pickRandomEligibleIdiom(ctx, state.activeTeam)

    if (!nextIdiom) {
      await moveVienameseGameToEnding(ctx, state)

      return {
        phase: 'ending' as const,
        activeIdiomId: null,
      }
    }

    const startedAt = Date.now()

    await Promise.all([
      upsertVienameseGame(ctx, {
        activeTeam: state.activeTeam,
        phase: 'playing',
        activeIdiomId: nextIdiom._id,
        roundScore: state.roundScore,
        startedAt,
        pausedAt: null,
        accumulatedPausedMs: 0,
        durationMs: state.durationMs,
      }),
      upsertGlobalStatus(ctx, {
        value: 'in-game:vienamese',
        team: vienameseStatus.team,
        phase: 'playing',
      }),
    ])

    return {
      phase: 'playing' as const,
      activeIdiomId: nextIdiom._id,
    }
  },
})

export const markPassed = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    assertVienameseStatus(currentStatus)
    const state = await getStoredVienameseGame(ctx)

    if (!state || state.phase !== 'playing') {
      throw new Error('The round is not currently playing.')
    }

    if (state.pausedAt) {
      throw new Error('The round is currently paused.')
    }

    if (!state.activeIdiomId) {
      throw new Error('No active idiom is selected.')
    }

    const activeIdiom = await ctx.db.get(state.activeIdiomId)

    if (!activeIdiom) {
      throw new Error('Active idiom not found.')
    }

    await patchIdiomStatus(ctx, activeIdiom, state.activeTeam, 'passed')

    const nextIdiom = await pickRandomEligibleIdiom(
      ctx,
      state.activeTeam,
      activeIdiom._id,
    )

    if (!nextIdiom) {
      await moveVienameseGameToEnding(ctx, state)

      return {
        phase: 'ending' as const,
        activeIdiomId: null,
      }
    }

    await upsertVienameseGame(ctx, {
      activeTeam: state.activeTeam,
      phase: 'playing',
      activeIdiomId: nextIdiom._id,
      roundScore: state.roundScore,
      startedAt: state.startedAt ?? null,
      pausedAt: state.pausedAt ?? null,
      accumulatedPausedMs: state.accumulatedPausedMs,
      durationMs: state.durationMs,
    })

    return {
      phase: 'playing' as const,
      activeIdiomId: nextIdiom._id,
    }
  },
})

export const markGuessed = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    assertVienameseStatus(currentStatus)
    const state = await getStoredVienameseGame(ctx)

    if (!state || state.phase !== 'playing') {
      throw new Error('The round is not currently playing.')
    }

    if (state.pausedAt) {
      throw new Error('The round is currently paused.')
    }

    if (!state.activeIdiomId) {
      throw new Error('No active idiom is selected.')
    }

    const activeIdiom = await ctx.db.get(state.activeIdiomId)

    if (!activeIdiom) {
      throw new Error('Active idiom not found.')
    }

    await Promise.all([
      patchIdiomStatus(ctx, activeIdiom, state.activeTeam, 'guessed'),
      adjustTeamScore(ctx, state.activeTeam, 2),
    ])

    const nextRoundScore = state.roundScore + 2
    const nextIdiom = await pickRandomEligibleIdiom(
      ctx,
      state.activeTeam,
      activeIdiom._id,
    )

    if (!nextIdiom) {
      await moveVienameseGameToEnding(ctx, {
        ...state,
        roundScore: nextRoundScore,
      })

      return {
        phase: 'ending' as const,
        activeIdiomId: null,
        roundScore: nextRoundScore,
      }
    }

    await upsertVienameseGame(ctx, {
      activeTeam: state.activeTeam,
      phase: 'playing',
      activeIdiomId: nextIdiom._id,
      roundScore: nextRoundScore,
      startedAt: state.startedAt ?? null,
      pausedAt: state.pausedAt ?? null,
      accumulatedPausedMs: state.accumulatedPausedMs,
      durationMs: state.durationMs,
    })

    return {
      phase: 'playing' as const,
      activeIdiomId: nextIdiom._id,
      roundScore: nextRoundScore,
    }
  },
})

export const endRound = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    assertVienameseStatus(currentStatus)
    const state = await getStoredVienameseGame(ctx)

    if (!state) {
      throw new Error('Tiếng Tây Tiếng Ta has not started yet.')
    }

    if (state.phase === 'ending') {
      return {
        phase: 'ending' as const,
      }
    }

    await moveVienameseGameToEnding(ctx, state)

    return {
      phase: 'ending' as const,
    }
  },
})

export const pause = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    assertVienameseStatus(currentStatus)
    const state = await getStoredVienameseGame(ctx)

    if (!state || state.phase !== 'playing') {
      throw new Error('The round is not currently playing.')
    }

    if (state.pausedAt) {
      return {
        pausedAt: state.pausedAt,
      }
    }

    const pausedAt = Date.now()

    await upsertVienameseGame(ctx, {
      activeTeam: state.activeTeam,
      phase: state.phase,
      activeIdiomId: state.activeIdiomId ?? null,
      roundScore: state.roundScore,
      startedAt: state.startedAt ?? null,
      pausedAt,
      accumulatedPausedMs: state.accumulatedPausedMs,
      durationMs: state.durationMs,
    })

    return {
      pausedAt,
    }
  },
})

export const resume = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    assertVienameseStatus(currentStatus)
    const state = await getStoredVienameseGame(ctx)

    if (!state || state.phase !== 'playing') {
      throw new Error('The round is not currently playing.')
    }

    if (!state.pausedAt) {
      return {
        pausedAt: null,
      }
    }

    const now = Date.now()
    const nextAccumulatedPausedMs =
      state.accumulatedPausedMs + (now - state.pausedAt)

    await upsertVienameseGame(ctx, {
      activeTeam: state.activeTeam,
      phase: state.phase,
      activeIdiomId: state.activeIdiomId ?? null,
      roundScore: state.roundScore,
      startedAt: state.startedAt ?? null,
      pausedAt: null,
      accumulatedPausedMs: nextAccumulatedPausedMs,
      durationMs: state.durationMs,
    })

    return {
      pausedAt: null,
      accumulatedPausedMs: nextAccumulatedPausedMs,
    }
  },
})

export const expireIfNeeded = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()

    if (currentStatus.value !== 'in-game:vienamese') {
      return {
        expired: false,
      }
    }

    const state = await getStoredVienameseGame(ctx)

    if (!state || state.phase !== 'playing') {
      return {
        expired: false,
      }
    }

    const remainingMs = calculateRemainingMs(state, Date.now())

    if (remainingMs > 0) {
      return {
        expired: false,
        remainingMs,
      }
    }

    await moveVienameseGameToEnding(ctx, state)

    return {
      expired: true,
      remainingMs: 0,
    }
  },
})

export const endToIdle = mutation({
  handler: async (ctx) => {
    const currentStatus =
      (await getStoredGlobalStatus(ctx))?.current ?? createIdleGlobalStatus()
    const vienameseStatus = assertVienameseStatus(currentStatus)
    const state = await getStoredVienameseGame(ctx)

    if (!state || state.phase !== 'ending') {
      throw new Error('The round has not ended yet.')
    }

    await Promise.all([
      deleteVienameseGame(ctx),
      upsertGlobalStatus(ctx, createIdleGlobalStatus()),
    ])

    return {
      team: vienameseStatus.team,
      ended: true,
    }
  },
})
