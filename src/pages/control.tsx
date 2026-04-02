import { Typography } from 'antd'
import { TeamBoardsGrid } from '../features/team-scoreboard/components/TeamBoardsGrid.tsx'
import { useTeamScores } from '../features/team-scoreboard/hooks/useTeamScores.ts'

function ControlPage() {
  const { teams, adjustScore, submittingKey } = useTeamScores()

  return (
    <section className="mx-auto grid max-w-[520px] gap-4">
      <header className="grid gap-3 rounded-[24px] border border-slate-900/8 bg-white/72 p-5 shadow-[0_24px_60px_rgba(148,163,184,0.16)] backdrop-blur-xl">
        <div>
          <Typography.Text className="mb-3 inline-block text-[0.8rem] font-bold uppercase tracking-[0.18em] text-slate-600">
            Control mode
          </Typography.Text>
          <Typography.Title
            className="!mb-0 !max-w-none !text-[clamp(2.2rem,8vw,3.2rem)] !leading-[0.95] !tracking-[-0.06em] !text-slate-900"
            level={1}
          >
            Update scores fast
          </Typography.Title>
        </div>

        <Typography.Paragraph className="!m-0 !text-[0.98rem] !leading-[1.6] !text-slate-700">
          Optimized for phone use with one clear column and large touch targets.
        </Typography.Paragraph>
      </header>

      <TeamBoardsGrid
        boardVariant="control"
        className="grid gap-3.5"
        mode="control"
        onAdjustScore={adjustScore}
        submittingKey={submittingKey}
        teams={teams}
      />
    </section>
  )
}

export default ControlPage
