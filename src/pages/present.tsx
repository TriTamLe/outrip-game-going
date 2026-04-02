import { GlobalStatusPanel } from '../features/global-status/components/GlobalStatusPanel.tsx'
import { PosturePresentOverlay } from '../features/posture-game/components/PosturePresentOverlay.tsx'
import { usePostureGame } from '../features/posture-game/hooks/usePostureGame.ts'
import { TeamBoardsGrid } from '../features/team-scoreboard/components/TeamBoardsGrid.tsx'
import { useTeamScores } from '../features/team-scoreboard/hooks/useTeamScores.ts'
import type { TeamCard, TeamKey } from '../features/team-scoreboard/teamMeta.ts'

function getPresentMarkers(teams: TeamCard[]) {
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

function PresentPage() {
  const { teams } = useTeamScores()
  const { activeWord, isPostureActive, showMembersOnPresent, status } =
    usePostureGame()
  const markers = getPresentMarkers(teams)
  const shouldShowStatusPanel =
    status !== undefined && status.value !== 'idle'

  return (
    <section className="grid min-h-[calc(100svh-72px)] max-[720px]:min-h-0">
      {shouldShowStatusPanel ? (
        <div className="pointer-events-none fixed right-6 top-6 z-20 w-[300px]">
          <div className="rounded-[24px] border border-slate-900/10 bg-slate-100/90 p-3 shadow-[0_20px_40px_rgba(148,163,184,0.2)] backdrop-blur-xl">
            <GlobalStatusPanel embedded />
          </div>
        </div>
      ) : null}

      <TeamBoardsGrid
        boardVariant="present"
        className="grid h-full content-stretch gap-6 lg:grid-cols-2 max-[720px]:grid-cols-1"
        markers={markers}
        mode="display"
        showMembers={showMembersOnPresent}
        teams={teams}
      />

      {isPostureActive && activeWord ? (
        <PosturePresentOverlay word={activeWord} />
      ) : null}
    </section>
  )
}

export default PresentPage
