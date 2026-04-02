import type { TeamCard, TeamKey } from './teamMeta.ts'

export function getTeamMarkers(teams: TeamCard[]) {
  if (teams.some((team) => team.score === null)) {
    return {} as Partial<Record<TeamKey, string>>
  }

  const sortedTeams = [...teams].sort(
    (leftTeam, rightTeam) => (rightTeam.score ?? 0) - (leftTeam.score ?? 0),
  )
  const markers: Partial<Record<TeamKey, string>> = {}
  let currentRank = 1

  for (let index = 0; index < sortedTeams.length; ) {
    const score = sortedTeams[index].score ?? 0
    let endIndex = index + 1

    while ((sortedTeams[endIndex]?.score ?? null) === score) {
      endIndex += 1
    }

    const marker =
      score === 0
        ? '🗿'
        : currentRank === 1
          ? '🥇'
          : currentRank === 2
            ? '🥈'
            : currentRank === 3
              ? '🥉'
              : '🗿'

    for (const team of sortedTeams.slice(index, endIndex)) {
      markers[team.key] = marker
    }

    currentRank += endIndex - index
    index = endIndex
  }

  return markers
}
