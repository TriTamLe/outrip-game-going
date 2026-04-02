import { Tag, Typography } from 'antd'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api.js'
import { teamMeta } from '../../team-scoreboard/teamMeta.ts'

const gameLabels = {
  'in-game:posture': 'Tâm Đầu Ý Hợp',
  'in-game:vienamese': 'Tiếng Tây Tiếng Ta',
} as const

const phaseLabels = {
  waiting: 'Waiting',
  playing: 'Playing',
  result: 'Result',
  ending: 'Ending',
} as const

const phaseColors = {
  waiting: 'default',
  playing: 'processing',
  result: 'success',
  ending: 'warning',
} as const

const teamNameByKey = Object.fromEntries(
  teamMeta.map((team) => [team.key, team.name]),
) as Record<(typeof teamMeta)[number]['key'], string>

type GlobalStatusPanelProps = {
  embedded?: boolean
}

export function GlobalStatusPanel({
  embedded = false,
}: GlobalStatusPanelProps) {
  const status = useQuery(api.globalStatus.get)
  const panelClassName = embedded
    ? 'rounded-[18px] bg-white/72 p-4'
    : 'rounded-[20px] border border-slate-900/8 bg-white/72 p-4 shadow-[0_18px_36px_rgba(148,163,184,0.14)] backdrop-blur-xl'

  if (status === undefined) {
    return (
      <section className={panelClassName}>
        <Typography.Text className="text-sm font-medium text-slate-500">
          Loading app status...
        </Typography.Text>
      </section>
    )
  }

  const isIdle = status.value === 'idle'

  return (
    <section className={panelClassName}>
      <div className="grid gap-2">
        <Typography.Title
          className="!mb-0 !text-[1.25rem] !font-medium !text-slate-900"
          level={4}
        >
          {isIdle ? 'Idle' : gameLabels[status.value]}
        </Typography.Title>

        {isIdle ? (
          <Typography.Text className="text-sm text-slate-600">
            The app is currently waiting to start a game.
          </Typography.Text>
        ) : (
          <div className="flex flex-wrap gap-2">
            {status.value === 'in-game:posture' ? (
              <Tag className="!mr-0 !rounded-full !px-3 !py-1 !font-medium">
                All teams
              </Tag>
            ) : (
              <Tag className="!mr-0 !rounded-full !px-3 !py-1 !font-medium">
                {teamNameByKey[status.team]}
              </Tag>
            )}
            <Tag
              className="!mr-0 !rounded-full !px-3 !py-1 !font-medium"
              color={phaseColors[status.phase]}
            >
              {phaseLabels[status.phase]}
            </Tag>
          </div>
        )}
      </div>
    </section>
  )
}
