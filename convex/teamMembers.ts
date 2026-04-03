import { mutation, query, type MutationCtx } from './_generated/server'
import { v } from 'convex/values'
import { teamOrder, teamValidator, type TeamKey } from './team'

const teamMemberInputValidator = v.object({
  teamKey: teamValidator,
  name: v.string(),
  isLeader: v.boolean(),
})

const defaultTeamMembers = [
  { teamKey: 'kindness', name: 'Hoang Nguyen', isLeader: true },
  { teamKey: 'kindness', name: 'Minh Vien', isLeader: false },
  { teamKey: 'kindness', name: 'Hieu Vo', isLeader: false },
  { teamKey: 'kindness', name: 'Trang Huynh', isLeader: false },
  { teamKey: 'kindness', name: 'Duy Phan', isLeader: false },
  { teamKey: 'kindness', name: 'Tri Vu', isLeader: false },
  { teamKey: 'kindness', name: 'Cat Nguyen', isLeader: false },
  { teamKey: 'oneTeam', name: 'Kiet Ta', isLeader: true },
  { teamKey: 'oneTeam', name: 'Tan Nguyen', isLeader: false },
  { teamKey: 'oneTeam', name: 'Duc Huy', isLeader: false },
  { teamKey: 'oneTeam', name: 'Han Ho', isLeader: false },
  { teamKey: 'oneTeam', name: 'Phu Nguyen', isLeader: false },
  { teamKey: 'oneTeam', name: 'Tuan Nguyen', isLeader: false },
  { teamKey: 'oneTeam', name: 'Huyen Nguyen', isLeader: false },
  { teamKey: 'excellence', name: 'Quoc Huynh', isLeader: true },
  { teamKey: 'excellence', name: 'Trinh Dang', isLeader: false },
  { teamKey: 'excellence', name: 'Dung Pham', isLeader: false },
  { teamKey: 'excellence', name: 'Tuyen Tran', isLeader: false },
  { teamKey: 'excellence', name: 'Nghia Huynh', isLeader: false },
  { teamKey: 'excellence', name: 'Nhi Le', isLeader: false },
  { teamKey: 'sustainability', name: 'Thinh Tran', isLeader: true },
  { teamKey: 'sustainability', name: 'Vy Duong', isLeader: false },
  { teamKey: 'sustainability', name: 'Nghia Tran', isLeader: false },
  { teamKey: 'sustainability', name: 'Huy Nguyen', isLeader: false },
  { teamKey: 'sustainability', name: 'Kiet Tran', isLeader: false },
  { teamKey: 'sustainability', name: 'Ngan Vo', isLeader: false },
  { teamKey: 'sustainability', name: 'Rikard', isLeader: false },
] as const satisfies ReadonlyArray<{
  teamKey: TeamKey
  name: string
  isLeader: boolean
}>

async function getNextOrder(ctx: MutationCtx, teamKey: TeamKey) {
  const lastMember = await ctx.db
    .query('teamMembers')
    .withIndex('by_team_order', (q) => q.eq('teamKey', teamKey))
    .order('desc')
    .first()

  return (lastMember?.order ?? -1) + 1
}

async function clearLeaderInTeam(
  ctx: MutationCtx,
  teamKey: TeamKey,
  keepId?: string,
) {
  const existingMembers = await ctx.db
    .query('teamMembers')
    .withIndex('by_team_order', (q) => q.eq('teamKey', teamKey))
    .collect()

  for (const member of existingMembers) {
    if (member.isLeader && member._id !== keepId) {
      await ctx.db.patch(member._id, {
        isLeader: false,
      })
    }
  }
}

export const list = query({
  handler: async (ctx) => {
    const members = await Promise.all(
      teamOrder.map(async (teamKey) => {
        return await ctx.db
          .query('teamMembers')
          .withIndex('by_team_order', (q) => q.eq('teamKey', teamKey))
          .collect()
      }),
    )

    return members.flat()
  },
})

export const seedDefaults = mutation({
  handler: async (ctx) => {
    const existingMember = await ctx.db.query('teamMembers').first()

    if (existingMember) {
      return {
        inserted: 0,
        skipped: true,
      }
    }

    let inserted = 0
    const orderByTeam = new Map<TeamKey, number>()

    for (const item of defaultTeamMembers) {
      const order = orderByTeam.get(item.teamKey) ?? 0

      await ctx.db.insert('teamMembers', {
        teamKey: item.teamKey,
        name: item.name,
        isLeader: item.isLeader,
        order,
      })

      orderByTeam.set(item.teamKey, order + 1)
      inserted += 1
    }

    return {
      inserted,
      skipped: false,
    }
  },
})

export const create = mutation({
  args: teamMemberInputValidator,
  handler: async (ctx, { teamKey, name, isLeader }) => {
    const normalizedName = name.trim()

    if (!normalizedName) {
      throw new Error('Member name is required.')
    }

    const duplicate = await ctx.db
      .query('teamMembers')
      .withIndex('by_team_name', (q) =>
        q.eq('teamKey', teamKey).eq('name', normalizedName),
      )
      .unique()

    if (duplicate) {
      throw new Error('This member already exists in the selected team.')
    }

    if (isLeader) {
      await clearLeaderInTeam(ctx, teamKey)
    }

    return await ctx.db.insert('teamMembers', {
      teamKey,
      name: normalizedName,
      isLeader,
      order: await getNextOrder(ctx, teamKey),
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('teamMembers'),
    ...teamMemberInputValidator.fields,
  },
  handler: async (ctx, { id, teamKey, name, isLeader }) => {
    const normalizedName = name.trim()

    if (!normalizedName) {
      throw new Error('Member name is required.')
    }

    const existing = await ctx.db.get(id)

    if (!existing) {
      throw new Error('Team member not found.')
    }

    const duplicate = await ctx.db
      .query('teamMembers')
      .withIndex('by_team_name', (q) =>
        q.eq('teamKey', teamKey).eq('name', normalizedName),
      )
      .unique()

    if (duplicate && duplicate._id !== id) {
      throw new Error('Another member already uses this name in the selected team.')
    }

    if (isLeader) {
      await clearLeaderInTeam(ctx, teamKey, id)
    }

    await ctx.db.patch(id, {
      teamKey,
      name: normalizedName,
      isLeader,
      order:
        existing.teamKey === teamKey
          ? existing.order
          : await getNextOrder(ctx, teamKey),
    })
  },
})

export const remove = mutation({
  args: {
    id: v.id('teamMembers'),
  },
  handler: async (ctx, { id }) => {
    const existing = await ctx.db.get(id)

    if (!existing) {
      return
    }

    await ctx.db.delete(id)
  },
})
