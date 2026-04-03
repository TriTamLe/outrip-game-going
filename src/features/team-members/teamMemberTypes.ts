import type { Id } from '../../../convex/_generated/dataModel'
import type { TeamKey } from '../team-scoreboard/teamMeta.ts'

export type TeamMemberRecord = {
  _id: Id<'teamMembers'>
  teamKey: TeamKey
  name: string
  isLeader: boolean
  order: number
}

export type TeamMemberFormValues = {
  teamKey: TeamKey
  name: string
  isLeader: boolean
}
