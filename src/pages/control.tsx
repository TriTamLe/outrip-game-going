import { Button, Affix } from 'antd'
import { GlobalStatusPanel } from '../features/global-status/components/GlobalStatusPanel.tsx'
import { InGamePostureModule } from '../features/posture-game/components/InGamePostureModule.tsx'
import { usePostureGame } from '../features/posture-game/hooks/usePostureGame.ts'
import { TeamBoardsGrid } from '../features/team-scoreboard/components/TeamBoardsGrid.tsx'
import { useComboTeamScores } from '../features/team-scoreboard/hooks/useComboTeamScores.ts'

function ControlPage() {
  const { teams, comboScores, queueScoreChange } = useComboTeamScores()
  const {
    activeWord,
    words,
    phase,
    isPostureActive,
    isLoading,
    isToggling,
    isTogglingMembers,
    isUpdatingWord,
    showMembersOnPresent,
    togglePostureGame,
    toggleMembersOnPresent,
    selectActiveWord,
    clearActiveWord,
  } = usePostureGame()

  return (
    <section className="mx-auto grid max-w-[520px] gap-4">
      <Affix offsetTop={16}>
        <div className="w-full rounded-[26px] border border-slate-900/10 bg-slate-100/88 p-3 shadow-[0_30px_70px_rgba(148,163,184,0.28)] backdrop-blur-xl">
          <div className="grid gap-3">
            <GlobalStatusPanel embedded />
            <Button
              className="!h-12 !rounded-2xl !font-semibold"
              loading={isToggling}
              onClick={() => void togglePostureGame()}
              type={isPostureActive ? 'default' : 'primary'}
            >
              {isPostureActive
                ? 'Stop Tâm Đầu Ý Hợp'
                : 'Start Tâm Đầu Ý Hợp'}
            </Button>
            <Button
              className="!h-12 !rounded-2xl !font-semibold"
              loading={isTogglingMembers}
              onClick={() => void toggleMembersOnPresent()}
              type={showMembersOnPresent ? 'primary' : 'default'}
            >
              {showMembersOnPresent
                ? 'Hide member list on present'
                : 'Show member list on present'}
            </Button>
          </div>
        </div>
      </Affix>

      {isPostureActive && !isLoading ? (
        <InGamePostureModule
          activeWord={activeWord}
          disabled={isUpdatingWord}
          onClearActiveWord={clearActiveWord}
          onSelectWord={selectActiveWord}
          phase={phase}
          words={words}
        />
      ) : null}

      <TeamBoardsGrid
        boardVariant="control"
        className="grid gap-3.5"
        comboScores={comboScores}
        mode="control"
        onAdjustScore={queueScoreChange}
        teams={teams}
      />
    </section>
  )
}

export default ControlPage
