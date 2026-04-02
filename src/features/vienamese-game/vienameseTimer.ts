export type VienameseTimerState = {
  startedAt: number | null
  pausedAt: number | null
  accumulatedPausedMs: number
  durationMs: number
}

export function getRemainingVienameseTime(
  state: VienameseTimerState,
  now = Date.now(),
) {
  if (!state.startedAt) {
    return state.durationMs
  }

  const effectiveNow = state.pausedAt ?? now
  const elapsedMs =
    effectiveNow - state.startedAt - state.accumulatedPausedMs

  return Math.max(state.durationMs - elapsedMs, 0)
}

export function formatVienameseTimer(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
