import { TeamBoard } from './TeamBoard.tsx'
import type { TeamCard, TeamKey } from '../teamMeta.ts'

type TeamBoardsGridProps = {
  teams: TeamCard[]
  mode: 'display' | 'control'
  boardVariant?: 'default' | 'present' | 'control'
  className?: string
  submittingKey?: TeamKey | null
  onAdjustScore?: (key: TeamKey, delta: number) => Promise<void>
}

export function TeamBoardsGrid({
  teams,
  mode,
  boardVariant = 'default',
  className = 'grid gap-5 lg:grid-cols-2',
  submittingKey = null,
  onAdjustScore,
}: TeamBoardsGridProps) {
  return (
    <div className={className}>
      {teams.map((team) => (
        <TeamBoard
          boardVariant={boardVariant}
          key={team.key}
          mode={mode}
          onAdjustScore={
            onAdjustScore ? (delta) => onAdjustScore(team.key, delta) : undefined
          }
          submitting={submittingKey === team.key}
          team={team}
        />
      ))}
    </div>
  )
}
