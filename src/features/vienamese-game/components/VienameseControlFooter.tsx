import { Button, Typography } from 'antd'
import { formatVienameseTimer } from '../vienameseTimer.ts'

type VienameseControlFooterProps = {
  phase: 'waiting' | 'playing' | 'ending'
  idiomText?: string | null
  remainingMs: number
  roundScore: number
  totalScore: number
  isPaused: boolean
  startLoading?: boolean
  passing?: boolean
  guessing?: boolean
  forceEnding?: boolean
  pauseLoading?: boolean
  resumeLoading?: boolean
  ending?: boolean
  onStart: () => void | Promise<void>
  onPass: () => void | Promise<void>
  onGuess: () => void | Promise<void>
  onEndRound: () => void | Promise<void>
  onPauseResume: () => void | Promise<void>
  onEndToIdle: () => void | Promise<void>
}

export function VienameseControlFooter({
  phase,
  idiomText = null,
  remainingMs,
  roundScore,
  totalScore,
  isPaused,
  startLoading = false,
  passing = false,
  guessing = false,
  forceEnding = false,
  pauseLoading = false,
  resumeLoading = false,
  ending = false,
  onStart,
  onPass,
  onGuess,
  onEndRound,
  onPauseResume,
  onEndToIdle,
}: VienameseControlFooterProps) {
  if (phase === 'waiting') {
    return (
      <div className="grid gap-3">
        <div className="rounded-[20px] border border-slate-900/8 bg-white/70 px-4 py-3">
          <Typography.Text className="text-sm font-medium text-slate-600">
            Tiếng Tây Tiếng Ta is ready. Tap start when the team is set.
          </Typography.Text>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            className="!h-12 !rounded-2xl !font-semibold"
            loading={startLoading}
            onClick={() => void onStart()}
            type="primary"
          >
            Start
          </Button>
          <Button
            className="!h-12 !rounded-2xl !font-semibold"
            loading={forceEnding}
            onClick={() => void onEndRound()}
          >
            End
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'playing') {
    return (
      <div className="grid gap-3">
        <div className="grid gap-2 rounded-[20px] border border-slate-900/8 bg-white/78 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Typography.Text className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Current idiom
            </Typography.Text>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold tracking-[0.14em] text-white">
              {formatVienameseTimer(remainingMs)}
            </span>
          </div>
          <Typography.Title
            className="!mb-0 !text-xl !leading-tight !text-slate-900"
            level={4}
          >
            {idiomText ?? 'Selecting idiom...'}
          </Typography.Title>
          <Typography.Text className="text-sm font-medium text-slate-500">
            Round score: {roundScore}
          </Typography.Text>
          {isPaused ? (
            <Typography.Text className="text-sm font-semibold text-amber-700">
              The round is paused.
            </Typography.Text>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            className="!h-12 !rounded-2xl !font-semibold"
            disabled={isPaused || !idiomText}
            loading={passing}
            onClick={() => void onPass()}
          >
            Passed
          </Button>
          <Button
            className="!h-12 !rounded-2xl !font-semibold"
            disabled={isPaused || !idiomText}
            loading={guessing}
            onClick={() => void onGuess()}
            type="primary"
          >
            Guessed
          </Button>
        </div>

        <Button
          className="!h-12 !rounded-2xl !font-semibold"
          loading={isPaused ? resumeLoading : pauseLoading}
          onClick={() => void onPauseResume()}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>

        <Button
          className="!h-12 !rounded-2xl !font-semibold"
          loading={forceEnding}
          onClick={() => void onEndRound()}
        >
          End
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-1 rounded-[20px] border border-slate-900/8 bg-white/78 px-4 py-4">
        <Typography.Text className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Round finished
        </Typography.Text>
        <Typography.Title className="!mb-0 !text-lg !text-slate-900" level={4}>
          Round score: {roundScore}
        </Typography.Title>
        <Typography.Text className="text-sm font-medium text-slate-600">
          Total team score: {totalScore}
        </Typography.Text>
      </div>
      <Button
        className="!h-12 !rounded-2xl !font-semibold"
        loading={ending}
        onClick={() => void onEndToIdle()}
        type="primary"
      >
        Back to idle
      </Button>
    </div>
  )
}
