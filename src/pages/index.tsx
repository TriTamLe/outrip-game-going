import {
  ArrowRightOutlined,
  BookOutlined,
  FileTextOutlined,
  TranslationOutlined,
} from '@ant-design/icons'
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
          <Typography.Text className="mb-3.5 inline-block text-[0.8rem] font-bold tracking-[0.18em] text-slate-600 uppercase">
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

          <div className="grid gap-3 sm:grid-cols-2">
            <section className="grid gap-4 rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_24px_50px_rgba(15,23,42,0.22)]">
              <div className="grid gap-1.5">
                <Typography.Text className="!m-0 !text-[0.72rem] !font-bold !tracking-[0.18em] !text-sky-200/90 !uppercase">
                  Game screens
                </Typography.Text>
                <Typography.Title
                  className="!mb-0 !text-xl !leading-tight !text-white"
                  level={4}
                >
                  Control and present
                </Typography.Title>
                <Typography.Paragraph className="!m-0 !text-sm !leading-6 !text-slate-300">
                  Jump into the score control view or the presentation screen.
                </Typography.Paragraph>
              </div>

              <div className="grid gap-2.5">
                <Button
                  className="!h-12 !rounded-2xl !border-0 !bg-white !px-5 !font-semibold !text-slate-950 hover:!bg-slate-100"
                  icon={<ArrowRightOutlined />}
                  onClick={() => void navigate({ to: '/control' })}
                  size="large"
                >
                  Open control
                </Button>
                <Button
                  className="!h-12 !rounded-2xl !border-white/20 !bg-white/8 !px-5 !font-semibold !text-white hover:!border-white/35 hover:!bg-white/14 hover:!text-white"
                  icon={<ArrowRightOutlined />}
                  onClick={() => void navigate({ to: '/present' })}
                  size="large"
                >
                  Open present
                </Button>
              </div>
            </section>

            <section className="grid gap-4 rounded-[28px] border border-slate-900/8 bg-slate-50/92 p-5 shadow-[0_18px_36px_rgba(148,163,184,0.12)]">
              <div className="grid gap-1.5">
                <Typography.Text className="!m-0 !text-[0.72rem] !font-bold !tracking-[0.18em] !text-slate-500 !uppercase">
                  Data CRUD
                </Typography.Text>
                <Typography.Title
                  className="!mb-0 !text-xl !leading-tight !text-slate-900"
                  level={4}
                >
                  Manage game content
                </Typography.Title>
                <Typography.Paragraph className="!m-0 !text-sm !leading-6 !text-slate-600">
                  Edit the source lists for idioms, posture words, and rule
                  sheets.
                </Typography.Paragraph>
              </div>

              <div className="grid gap-2.5">
                <Button
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-white !px-5 !font-semibold !text-slate-800 hover:!border-slate-300 hover:!text-slate-950"
                  icon={<BookOutlined />}
                  onClick={() => void navigate({ to: '/idioms' })}
                  size="large"
                >
                  Open idioms
                </Button>
                <Button
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-white !px-5 !font-semibold !text-slate-800 hover:!border-slate-300 hover:!text-slate-950"
                  icon={<TranslationOutlined />}
                  onClick={() => void navigate({ to: '/posture-words' })}
                  size="large"
                >
                  Open posture words
                </Button>
                <Button
                  className="!h-12 !rounded-2xl !border-slate-200 !bg-white !px-5 !font-semibold !text-slate-800 hover:!border-slate-300 hover:!text-slate-950"
                  icon={<FileTextOutlined />}
                  onClick={() => void navigate({ to: '/rules' })}
                  size="large"
                >
                  Open rules
                </Button>
              </div>
            </section>
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
