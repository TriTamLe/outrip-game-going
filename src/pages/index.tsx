import { ArrowRightOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Typography } from 'antd'
import { TeamBoardsGrid } from '../features/team-scoreboard/components/TeamBoardsGrid.tsx'
import { useTeamScores } from '../features/team-scoreboard/hooks/useTeamScores.ts'

function IndexPage() {
  const navigate = useNavigate()
  const { teams, adjustScore, submittingKey } = useTeamScores()

  return (
    <section className="grid gap-6">
      <header className="grid gap-6 rounded-[32px] border border-slate-900/8 bg-white/72 p-6 shadow-[0_24px_60px_rgba(148,163,184,0.16)] backdrop-blur-xl lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] lg:items-end lg:p-10">
        <div>
          <Typography.Text className="mb-3.5 inline-block text-[0.8rem] font-bold uppercase tracking-[0.18em] text-slate-600">
            Team score tracker
          </Typography.Text>
          <Typography.Title
            className="!mb-0 max-w-[12ch] !text-[clamp(2.6rem,6vw,4.8rem)] !leading-[0.95] !tracking-[-0.06em] !text-slate-900 max-lg:!max-w-none"
            level={1}
          >
            Keep the four core teams moving together.
          </Typography.Title>
        </div>

        <div className="grid gap-[18px] lg:self-end">
          <Typography.Paragraph className="!m-0 !text-base !leading-8 !text-slate-700">
            Each board keeps its own running score in Convex. Enter a positive
            or negative number, then submit to update the team total instantly.
          </Typography.Paragraph>

          <div className="flex flex-wrap gap-3 max-lg:flex-col">
            <Button
              className="!h-12 !rounded-2xl !px-5 !font-semibold"
              icon={<BookOutlined />}
              onClick={() => void navigate({ to: '/idioms' })}
              size="large"
              type="primary"
            >
              Open idioms
            </Button>
            <Button
              className="!h-12 !rounded-2xl !px-5 !font-semibold"
              icon={<ArrowRightOutlined />}
              onClick={() => void navigate({ to: '/control' })}
              size="large"
            >
              Open control
            </Button>
            <Button
              className="!h-12 !rounded-2xl !px-5 !font-semibold"
              icon={<ArrowRightOutlined />}
              onClick={() => void navigate({ to: '/present' })}
              size="large"
            >
              Open present
            </Button>
          </div>
        </div>
      </header>

      <TeamBoardsGrid
        boardVariant="default"
        className="grid gap-5 lg:grid-cols-2"
        mode="control"
        onAdjustScore={adjustScore}
        submittingKey={submittingKey}
        teams={teams}
      />
    </section>
  )
}

export default IndexPage
