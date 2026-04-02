import { Typography } from 'antd'
import { TeamBoardsGrid } from '../features/team-scoreboard/components/TeamBoardsGrid.tsx'
import { useTeamScores } from '../features/team-scoreboard/hooks/useTeamScores.ts'

function PresentPage() {
  const { teams } = useTeamScores()

  return (
    <section className="grid min-h-[calc(100svh-72px)] grid-rows-[auto_1fr] gap-6 max-[720px]:min-h-0">
      <header className="grid gap-6 rounded-[32px] border border-slate-900/8 bg-white/72 p-[clamp(28px,4vw,42px)] shadow-[0_24px_60px_rgba(148,163,184,0.16)] backdrop-blur-xl lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)] lg:items-end">
        <div>
          <Typography.Text className="mb-3.5 inline-block text-[0.95rem] font-bold uppercase tracking-[0.18em] text-slate-600">
            Presentation mode
          </Typography.Text>
          <Typography.Title
            className="!mb-0 !max-w-none !text-[clamp(3.2rem,7vw,6rem)] !leading-[0.92] !tracking-[-0.06em] !text-slate-900"
            level={1}
          >
            Live team scores
          </Typography.Title>
        </div>

        <Typography.Paragraph className="!m-0 self-end !text-[clamp(1.05rem,1.8vw,1.35rem)] !leading-[1.6] !text-slate-700">
          Built to sit on a big screen and stay readable from across the room.
        </Typography.Paragraph>
      </header>

      <TeamBoardsGrid
        boardVariant="present"
        className="grid content-stretch gap-6 lg:grid-cols-2 max-[720px]:grid-cols-1"
        mode="display"
        teams={teams}
      />
    </section>
  )
}

export default PresentPage
