import {
  BookOutlined,
  HomeOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Affix, Button, Collapse } from 'antd'
import { useState } from 'react'
import { InGamePostureModule } from '../features/posture-game/components/InGamePostureModule.tsx'
import { usePostureGame } from '../features/posture-game/hooks/usePostureGame.ts'
import { TeamBoard } from '../features/team-scoreboard/components/TeamBoard.tsx'
import { getTeamMarkers } from '../features/team-scoreboard/getTeamMarkers.ts'
import { useComboTeamScores } from '../features/team-scoreboard/hooks/useComboTeamScores.ts'
import { VienameseControlFooter } from '../features/vienamese-game/components/VienameseControlFooter.tsx'
import { useVienameseGame } from '../features/vienamese-game/hooks/useVienameseGame.ts'
import { ruleGames, ruleMetaByStatus } from '../features/rules/ruleMeta.ts'
import { useRuleStatus } from '../features/rules/hooks/useRuleStatus.ts'

function ControlPage() {
  const navigate = useNavigate()
  const {
    teams,
    comboScores,
    queueScoreChange,
    resettingKey,
    resetScore,
  } = useComboTeamScores()
  const {
    activeWord,
    words,
    phase: posturePhase,
    isPostureActive,
    isLoading: isPostureLoading,
    isToggling,
    isTogglingMembers,
    isUpdatingWord,
    showMembersOnPresent,
    togglePostureGame,
    toggleMembersOnPresent,
    selectActiveWord,
    clearActiveWord,
  } = usePostureGame()
  const {
    status,
    isVienameseActive,
    activeTeam,
    phase: vienamesePhase,
    activeIdiom,
    roundScore,
    remainingMs,
    isPaused,
    startingTeamKey,
    isBeginning,
    isPassing,
    isGuessing,
    isForceEnding,
    isPausing,
    isResuming,
    isEnding,
    startForTeam,
    beginPlaying,
    markPassed,
    markGuessed,
    endRound,
    pause,
    resume,
    endToIdle,
  } = useVienameseGame()
  const {
    activeRuleGame,
    togglingRuleKey,
    toggleRule,
  } = useRuleStatus()
  const [isAffixed, setIsAffixed] = useState(false)

  const isStartingVienamese = startingTeamKey !== null
  const postureToggleDisabled =
    status === undefined ||
    (status.value !== 'idle' && status.value !== 'in-game:posture') ||
    isStartingVienamese
  const ruleButtonsDisabled =
    status === undefined ||
    status.value === 'in-game:posture' ||
    status.value === 'in-game:vienamese'
  const playTtttDisabled =
    status === undefined ||
    status.value !== 'idle' ||
    isStartingVienamese ||
    isToggling
  const activeRuleStatus =
    status &&
    (status.value === 'rule:posture' ||
      status.value === 'rule:vienamese' ||
      status.value === 'rule:async-battle' ||
      status.value === 'rule:kind-hunt')
      ? status.value
      : null
  const statusPillText = !status
    ? 'Loading...'
    : status.value === 'idle'
      ? 'Idle'
      : activeRuleStatus
        ? `Rule · ${ruleMetaByStatus[activeRuleStatus].name}`
        : status.value === 'in-game:posture'
          ? 'In-game · Tâm Đầu Ý Hợp'
          : 'In-game · Tiếng Tây Tiếng Ta'
  const markers = getTeamMarkers(teams)
  const ruleCollapseItems = [
    {
      key: 'rules',
      label: (
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-slate-600">
          Show rules
        </span>
      ),
      children: (
        <div className="grid gap-2 pt-1 sm:grid-cols-2">
          {ruleGames.map((ruleGame) => (
            <Button
              className="!h-10 !rounded-2xl !font-medium"
              disabled={ruleButtonsDisabled}
              icon={<BookOutlined />}
              key={ruleGame.key}
              loading={togglingRuleKey === ruleGame.key}
              onClick={() => void toggleRule(ruleGame.key)}
              type={activeRuleGame === ruleGame.key ? 'primary' : 'default'}
            >
              {ruleGame.name}
            </Button>
          ))}
        </div>
      ),
    },
  ]

  return (
    <section className="mx-auto grid max-w-[520px] gap-4">
      <Affix offsetTop={16} onChange={(affixed) => setIsAffixed(Boolean(affixed))}>
        <div className="w-full rounded-[24px] border border-slate-900/10 bg-slate-100/88 p-3 shadow-[0_30px_70px_rgba(148,163,184,0.28)] backdrop-blur-xl">
          <div className="grid gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-full bg-white/78 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(148,163,184,0.12)]">
                {statusPillText}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  aria-label="Back to home"
                  className="!h-10 !w-10 !rounded-full !border-0 !bg-white/78 !text-slate-700 shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
                  icon={<HomeOutlined />}
                  onClick={() => void navigate({ to: '/' })}
                />
                <Button
                  aria-label={
                    showMembersOnPresent
                      ? 'Hide member list on present'
                      : 'Show member list on present'
                  }
                  className="!h-10 !w-10 !rounded-full !border-0 !bg-white/78 !text-slate-700 shadow-[0_10px_24px_rgba(148,163,184,0.12)]"
                  icon={
                    showMembersOnPresent ? (
                      <EyeInvisibleOutlined />
                    ) : (
                      <EyeOutlined />
                    )
                  }
                  loading={isTogglingMembers}
                  onClick={() => void toggleMembersOnPresent()}
                />
              </div>
            </div>

            {!isAffixed ? (
              <Collapse
                bordered={false}
                className="overflow-hidden rounded-[18px] bg-white/62"
                defaultActiveKey={['rules']}
                expandIconPosition="end"
                items={ruleCollapseItems}
              />
            ) : null}

            {!isAffixed ? (
              <Button
                className="!h-12 !rounded-2xl !font-semibold"
                disabled={postureToggleDisabled}
                loading={isToggling}
                onClick={() => void togglePostureGame()}
                type={isPostureActive ? 'default' : 'primary'}
              >
                {isPostureActive
                  ? 'Stop Tâm Đầu Ý Hợp'
                  : 'Start Tâm Đầu Ý Hợp'}
              </Button>
            ) : null}
          </div>
        </div>
      </Affix>

      {isPostureActive && !isPostureLoading ? (
        <InGamePostureModule
          activeWord={activeWord}
          disabled={isUpdatingWord}
          onClearActiveWord={clearActiveWord}
          onSelectWord={selectActiveWord}
          phase={posturePhase}
          words={words}
        />
      ) : null}

      <div className="grid gap-3.5">
        {teams.map((team) => {
          const isActiveVienameseBoard =
            isVienameseActive &&
            activeTeam === team.key &&
            vienamesePhase !== null

          const footer = isActiveVienameseBoard && vienamesePhase ? (
            <VienameseControlFooter
              ending={isEnding}
              guessing={isGuessing}
              idiomText={activeIdiom?.text ?? null}
              forceEnding={isForceEnding}
              isPaused={isPaused}
              onEndRound={endRound}
              onEndToIdle={endToIdle}
              onGuess={markGuessed}
              onPass={markPassed}
              onPauseResume={isPaused ? resume : pause}
              onStart={beginPlaying}
              passing={isPassing}
              pauseLoading={isPausing}
              phase={vienamesePhase}
              remainingMs={remainingMs}
              resumeLoading={isResuming}
              roundScore={roundScore}
              startLoading={isBeginning}
              totalScore={team.score ?? 0}
            />
          ) : (
            <Button
              className="!h-12 !rounded-2xl !font-semibold"
              disabled={playTtttDisabled}
              loading={startingTeamKey === team.key}
              onClick={() => void startForTeam(team.key)}
            >
              Play TTTT
            </Button>
          )

          return (
            <TeamBoard
              boardVariant="control"
              comboScore={comboScores[team.key] ?? 0}
              controlFooter={footer}
              hideControlButtons={isActiveVienameseBoard}
              key={team.key}
              marker={markers[team.key] ?? null}
              mode="control"
              onAdjustScore={(delta) => queueScoreChange(team.key, delta)}
              onResetScore={() => resetScore(team.key)}
              resetting={resettingKey === team.key}
              team={team}
            />
          )
        })}
      </div>
    </section>
  )
}

export default ControlPage
