import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api.js'
import { teamMeta, type TeamCard } from '../teamMeta.ts'

export function useTeamCards() {
  const teamScores = useQuery(api.teams.list)
  const scoresByKey = new Map(
    (teamScores ?? []).map((team) => [team.key, team.score] as const),
  )

  const teams: TeamCard[] = teamMeta.map((team) => ({
    ...team,
    score: teamScores === undefined ? null : (scoresByKey.get(team.key) ?? 0),
  }))

  return {
    teams,
  }
}
