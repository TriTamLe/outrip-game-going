import { PosturePresentOverlay } from '../features/posture-game/components/PosturePresentOverlay.tsx'
import { usePostureGame } from '../features/posture-game/hooks/usePostureGame.ts'
import { TeamBoardsGrid } from '../features/team-scoreboard/components/TeamBoardsGrid.tsx'
import { getTeamMarkers } from '../features/team-scoreboard/getTeamMarkers.ts'
import { useTeamScores } from '../features/team-scoreboard/hooks/useTeamScores.ts'
import { VienamesePresentBoard } from '../features/vienamese-game/components/VienamesePresentBoard.tsx'
import { useVienameseGame } from '../features/vienamese-game/hooks/useVienameseGame.ts'

function PresentPage() {
  const { teams } = useTeamScores()
  const {
    activeWord,
    isPostureActive,
    showMembersOnPresent,
  } = usePostureGame()
  const {
    isVienameseActive,
    activeTeam,
    phase: vienamesePhase,
    activeIdiom,
    roundScore,
    remainingMs,
  } = useVienameseGame()
  const markers = getTeamMarkers(teams)
  const activeVienameseTeam =
    (activeTeam
      ? teams.find((team) => team.key === activeTeam)
      : null) ?? null

  return (
    <section className="grid min-h-[calc(100svh-72px)] max-[720px]:min-h-0">
      {isVienameseActive && activeVienameseTeam && vienamesePhase ? (
        <VienamesePresentBoard
          idiomText={activeIdiom?.text ?? null}
          phase={vienamesePhase}
          remainingMs={remainingMs}
          roundScore={roundScore}
          showMembers={showMembersOnPresent}
          team={activeVienameseTeam}
          totalScore={activeVienameseTeam.score ?? 0}
        />
      ) : (
        <>
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
        </>
      )}
    </section>
  )
}

export default PresentPage
