import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type { TeamKey } from '../../team-scoreboard/teamMeta.ts'
import { getRemainingVienameseTime } from '../vienameseTimer.ts'

export function useVienameseGame() {
  const { message } = AntdApp.useApp()
  const status = useQuery(api.globalStatus.get)
  const state = useQuery(api.vienameseGame.getState)
  const startForTeamMutation = useMutation(api.vienameseGame.startForTeam)
  const beginPlayingMutation = useMutation(api.vienameseGame.beginPlaying)
  const markPassedMutation = useMutation(api.vienameseGame.markPassed)
  const markGuessedMutation = useMutation(api.vienameseGame.markGuessed)
  const endRoundMutation = useMutation(api.vienameseGame.endRound)
  const pauseMutation = useMutation(api.vienameseGame.pause)
  const resumeMutation = useMutation(api.vienameseGame.resume)
  const expireIfNeededMutation = useMutation(api.vienameseGame.expireIfNeeded)
  const endToIdleMutation = useMutation(api.vienameseGame.endToIdle)
  const [startingTeamKey, setStartingTeamKey] = useState<TeamKey | null>(null)
  const [isBeginning, setIsBeginning] = useState(false)
  const [isPassing, setIsPassing] = useState(false)
  const [isGuessing, setIsGuessing] = useState(false)
  const [isForceEnding, setIsForceEnding] = useState(false)
  const [isPausing, setIsPausing] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [tickNow, setTickNow] = useState(() => Date.now())
  const expireKeyRef = useRef<string | null>(null)

  const vienameseStatus = status?.value === 'in-game:vienamese' ? status : null
  const isVienameseActive = vienameseStatus !== null
  const phase = vienameseStatus?.phase ?? null
  const activeTeam = vienameseStatus?.team ?? null
  const isPaused = Boolean(
    isVienameseActive &&
      phase === 'playing' &&
      state?.pausedAt,
  )

  const remainingMs = useMemo(() => {
    if (!state) {
      return 5 * 60 * 1000
    }

    return getRemainingVienameseTime(
      {
        startedAt: state.startedAt,
        pausedAt: state.pausedAt,
        accumulatedPausedMs: state.accumulatedPausedMs,
        durationMs: state.durationMs,
      },
      tickNow,
    )
  }, [state, tickNow])

  useEffect(() => {
    if (!isVienameseActive || phase !== 'playing' || isPaused) {
      return
    }

    const interval = window.setInterval(() => {
      setTickNow(Date.now())
    }, 250)

    return () => {
      window.clearInterval(interval)
    }
  }, [isPaused, isVienameseActive, phase])

  useEffect(() => {
    if (!isVienameseActive || phase !== 'playing' || isPaused) {
      expireKeyRef.current = null
      return
    }

    const expireKey = `${activeTeam ?? 'none'}-${state?.startedAt ?? 0}-${state?.pausedAt ?? 'live'}`

    if (remainingMs > 0 || expireKeyRef.current === expireKey) {
      return
    }

    expireKeyRef.current = expireKey
    void expireIfNeededMutation({})
  }, [
    activeTeam,
    expireIfNeededMutation,
    isPaused,
    isVienameseActive,
    phase,
    remainingMs,
    state?.pausedAt,
    state?.startedAt,
  ])

  async function startForTeam(team: TeamKey) {
    setStartingTeamKey(team)

    try {
      await startForTeamMutation({ team })
    } catch (error) {
      console.error(error)
      void message.error('Unable to start Tiếng Tây Tiếng Ta right now.')
    } finally {
      setStartingTeamKey((currentTeam) =>
        currentTeam === team ? null : currentTeam,
      )
    }
  }

  async function beginPlaying() {
    setIsBeginning(true)

    try {
      await beginPlayingMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to begin the round right now.')
    } finally {
      setIsBeginning(false)
    }
  }

  async function markPassed() {
    setIsPassing(true)

    try {
      await markPassedMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to pass this idiom right now.')
    } finally {
      setIsPassing(false)
    }
  }

  async function markGuessed() {
    setIsGuessing(true)

    try {
      await markGuessedMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to mark this idiom as guessed right now.')
    } finally {
      setIsGuessing(false)
    }
  }

  async function pause() {
    setIsPausing(true)

    try {
      await pauseMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to pause the round right now.')
    } finally {
      setIsPausing(false)
    }
  }

  async function resume() {
    setIsResuming(true)

    try {
      await resumeMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to resume the round right now.')
    } finally {
      setIsResuming(false)
    }
  }

  async function endRound() {
    setIsForceEnding(true)

    try {
      await endRoundMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to end the round right now.')
    } finally {
      setIsForceEnding(false)
    }
  }

  async function endToIdle() {
    setIsEnding(true)

    try {
      await endToIdleMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to finish the round right now.')
    } finally {
      setIsEnding(false)
    }
  }

  return {
    status,
    isLoading: status === undefined || state === undefined,
    isVienameseActive,
    activeTeam,
    phase,
    activeIdiom: state?.activeIdiom ?? null,
    activeIdiomId: state?.activeIdiomId ?? null,
    roundScore: state?.roundScore ?? 0,
    remainingMs,
    isPaused,
    startingTeamKey,
    isBeginning,
    isPassing,
    isGuessing,
    isForceEnding,
    isPausing,
    isResuming,
    isEnding,
    startForTeam,
    beginPlaying,
    markPassed,
    markGuessed,
    endRound,
    pause,
    resume,
    endToIdle,
  }
}
