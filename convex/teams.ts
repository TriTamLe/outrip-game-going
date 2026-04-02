import { mutation, query, type MutationCtx } from './_generated/server'
import { v } from 'convex/values'
import { teamNames, teamOrder, teamValidator, type TeamKey } from './team'

export async function adjustTeamScore(
  ctx: MutationCtx,
  key: TeamKey,
  delta: number,
) {
  const existingTeam = await ctx.db
    .query('teams')
    .withIndex('by_key', (q) => q.eq('key', key))
    .unique()

  if (existingTeam) {
    const nextScore = existingTeam.score + delta

    await ctx.db.patch(existingTeam._id, {
      score: nextScore,
    })

    return nextScore
  }

  await ctx.db.insert('teams', {
    key,
    name: teamNames[key],
    score: delta,
  })

  return delta
}

export async function resetTeamScore(ctx: MutationCtx, key: TeamKey) {
  const existingTeam = await ctx.db
    .query('teams')
    .withIndex('by_key', (q) => q.eq('key', key))
    .unique()

  if (existingTeam) {
    await ctx.db.patch(existingTeam._id, {
      score: 0,
    })

    return 0
  }

  await ctx.db.insert('teams', {
    key,
    name: teamNames[key],
    score: 0,
  })

  return 0
}

export const list = query({
  handler: async (ctx) => {
    const existingTeams = await ctx.db.query('teams').collect()
    const scoresByKey = new Map(
      existingTeams.map((team) => [team.key, team.score] as const),
    )

    return teamOrder.map((key) => ({
      key,
      name: teamNames[key],
      score: scoresByKey.get(key) ?? 0,
    }))
  },
})

export const adjustScore = mutation({
  args: {
    key: teamValidator,
    delta: v.number(),
  },
  handler: async (ctx, { key, delta }) => {
    return await adjustTeamScore(ctx, key, delta)
  },
})

export const resetScore = mutation({
  args: {
    key: teamValidator,
  },
  handler: async (ctx, { key }) => {
    return await resetTeamScore(ctx, key)
  },
})
