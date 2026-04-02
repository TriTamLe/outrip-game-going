import { TeamBoard } from './TeamBoard.tsx'
import type { TeamCard, TeamKey } from '../teamMeta.ts'

type TeamBoardsGridProps = {
  teams: TeamCard[]
  mode: 'display' | 'control'
  boardVariant?: 'default' | 'present' | 'control'
  className?: string
  submittingKey?: TeamKey | null
  comboScores?: Partial<Record<TeamKey, number>>
  markers?: Partial<Record<TeamKey, string>>
  showMembers?: boolean
  onAdjustScore?: (key: TeamKey, delta: number) => void | Promise<void>
}

export function TeamBoardsGrid({
  teams,
  mode,
  boardVariant = 'default',
  className = 'grid gap-5 lg:grid-cols-2',
  submittingKey = null,
  comboScores = {},
  markers = {},
  showMembers = true,
  onAdjustScore,
}: TeamBoardsGridProps) {
  return (
    <div className={className}>
      {teams.map((team) => (
        <TeamBoard
          boardVariant={boardVariant}
          comboScore={comboScores[team.key] ?? 0}
          key={team.key}
          marker={markers[team.key] ?? null}
          mode={mode}
          onAdjustScore={
            onAdjustScore
              ? (delta) => onAdjustScore(team.key, delta)
              : undefined
          }
          showMembers={showMembers}
          submitting={submittingKey === team.key}
          team={team}
        />
      ))}
    </div>
  )
}
