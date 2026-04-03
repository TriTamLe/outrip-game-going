import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api.js'
import { teamMeta, type TeamCard } from '../teamMeta.ts'

export function useTeamCards() {
  const teamScores = useQuery(api.teams.list)
  const teamMembers = useQuery(api.teamMembers.list)
  const scoresByKey = new Map(
    (teamScores ?? []).map((team) => [team.key, team.score] as const),
  )
  const membersByTeam = new Map(
    teamMeta.map((team) => [
      team.key,
      (teamMembers ?? [])
        .filter((member) => member.teamKey === team.key)
        .map((member) => ({
          name: member.name,
          role: member.isLeader ? 'Team Leader' : undefined,
        })),
    ]),
  )

  const teams: TeamCard[] = teamMeta.map((team) => ({
    ...team,
    members:
      teamMembers === undefined
        ? team.members
        : (membersByTeam.get(team.key) ?? []),
    score: teamScores === undefined ? null : (scoresByKey.get(team.key) ?? 0),
  }))

  return {
    teams,
  }
}
