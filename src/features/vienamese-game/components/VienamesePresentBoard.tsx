import { Typography } from 'antd'
import type { CSSProperties } from 'react'
import type { TeamCard } from '../../team-scoreboard/teamMeta.ts'
import { formatVienameseTimer } from '../vienameseTimer.ts'

type VienamesePresentBoardProps = {
  team: TeamCard
  phase: 'waiting' | 'playing' | 'ending'
  idiomText?: string | null
  remainingMs: number
  roundScore: number
  totalScore: number
  showMembers: boolean
}

export function VienamesePresentBoard({
  team,
  phase,
  idiomText = null,
  remainingMs,
  roundScore,
  totalScore,
  showMembers,
}: VienamesePresentBoardProps) {
  const scoreBadge = (
    <div className="rounded-[28px] bg-white/80 px-6 py-4 shadow-[0_16px_34px_rgba(148,163,184,0.16)]">
      <div className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
        Score
      </div>
      <div className="pt-2 text-[clamp(2.8rem,5vw,4.4rem)] leading-none font-bold tracking-[-0.05em] text-slate-950">
        {totalScore} <span className="align-[0.18em] text-[0.42em]">🌸</span>
      </div>
    </div>
  )

  const timerBadge = (
    <div className="rounded-[28px] bg-slate-950 px-6 py-4 shadow-[0_18px_36px_rgba(15,23,42,0.2)]">
      <div className="text-xs font-semibold tracking-[0.18em] text-white/60 uppercase">
        Time
      </div>
      <div className="pt-2 text-[clamp(2.8rem,5vw,4.4rem)] leading-none font-bold tracking-[0.02em] text-white">
        {formatVienameseTimer(remainingMs)}
      </div>
    </div>
  )

  return (
    <section
      className="relative grid min-h-[calc(100svh-72px)] overflow-hidden rounded-[36px] border-0 p-8 shadow-[0_32px_90px_rgba(15,23,42,0.18)] sm:p-10 lg:p-12"
      style={{ backgroundImage: team.surface } as CSSProperties}
    >
      <div
        className="absolute inset-x-0 top-0 h-2"
        style={{ backgroundColor: team.accent }}
      />

      <div className="grid h-full gap-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <Typography.Title
            className="!mb-0 !text-[clamp(2.8rem,5vw,4.6rem)] !leading-[0.95] !tracking-[-0.05em] !text-slate-950"
            level={1}
          >
            {team.name}
          </Typography.Title>

          {phase === 'waiting' ? (
            <div className="rounded-full bg-white/76 px-4 py-2 text-2xl font-medium text-slate-600 shadow-[0_12px_28px_rgba(148,163,184,0.14)]">
              Everyone get ready...
            </div>
          ) : null}

          {phase === 'playing' ? (
            <div className="flex flex-wrap items-stretch gap-4">
              {scoreBadge}
              {timerBadge}
            </div>
          ) : null}

          {phase === 'ending' ? <div>{scoreBadge}</div> : null}
        </div>

        {phase === 'waiting' ? (
          showMembers ? (
            <div className="grid content-start gap-4">
              <p className="text-3xl font-semibold tracking-[0.16em] text-slate-500 uppercase">
                Team Members
              </p>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {team.members.map((member) => (
                  <div
                    className={`rounded-[20px] px-4 py-3 ${
                      member.role
                        ? 'border border-white/80 bg-white/76'
                        : 'bg-white/54'
                    }`}
                    key={`${team.key}-${member.name}`}
                  >
                    <div className="text-2xl leading-tight font-semibold text-slate-900">
                      {member.name}
                    </div>
                    {member.role ? (
                      <div className="pt-1 text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        {member.role}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid place-items-center">
              <Typography.Text className="text-xl font-medium text-slate-500">
                Team is getting ready to play.
              </Typography.Text>
            </div>
          )
        ) : null}

        {phase === 'playing' ? (
          <div className="grid flex-1 content-start pt-[3vh] text-center">
            <div className="mx-auto grid max-w-[1700px] gap-4">
              <Typography.Title
                className="!mb-0 !text-[clamp(4.8rem,10vw,8.6rem)] !leading-[0.9] !tracking-[-0.06em] !text-slate-950"
                level={1}
              >
                {idiomText ?? '...'}
              </Typography.Title>
            </div>
          </div>
        ) : null}

        {phase === 'ending' ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div className="grid place-items-center gap-6">
              <div className="text-[36px] font-semibold tracking-[0.02em] text-slate-600">
                Congratulations!
              </div>
              <Typography.Title
                className="!mb-0 !text-[clamp(5rem,11vw,8rem)] !leading-[0.9] !tracking-[-0.06em] !text-slate-950"
                level={1}
              >
                +{roundScore}
              </Typography.Title>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
