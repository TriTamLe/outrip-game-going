import type { Id } from '../../../convex/_generated/dataModel'
import { teamMeta, type TeamKey } from '../team-scoreboard/teamMeta.ts'

export const idiomStatusValues = [
  'not-displayed',
  'passed',
  'guessed',
] as const

export type IdiomStatusValue = (typeof idiomStatusValues)[number]

export type IdiomStatus = Record<TeamKey, IdiomStatusValue>

export type IdiomRecord = {
  _id: Id<'idioms'>
  order: number
  text: string
  status: IdiomStatus
}

export type IdiomFormValues = {
  text: string
  status: IdiomStatus
}

export function createDefaultIdiomStatus(): IdiomStatus {
  return {
    kindness: 'not-displayed',
    oneTeam: 'not-displayed',
    excellence: 'not-displayed',
    sustainability: 'not-displayed',
  }
}

export const idiomStatusOptions = [
  {
    value: 'not-displayed' as const,
    label: 'Not displayed',
    color: '#94a3b8',
  },
  {
    value: 'passed' as const,
    label: 'Passed',
    color: '#2563eb',
  },
  {
    value: 'guessed' as const,
    label: 'Guessed',
    color: '#16a34a',
  },
]

export const idiomStatusMeta = Object.fromEntries(
  idiomStatusOptions.map((option) => [option.value, option]),
) as Record<
  IdiomStatusValue,
  {
    value: IdiomStatusValue
    label: string
    color: string
  }
>

export const idiomTeams = teamMeta.map((team) => ({
  key: team.key,
  name: team.name,
}))
