import { App as AntdApp } from 'antd'
import { useMutation } from 'convex/react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import { type TeamKey } from '../teamMeta.ts'
import { useTeamCards } from './useTeamCards.ts'

const COMBO_IDLE_MS = 500

type ComboScoresMap = Partial<Record<TeamKey, number>>
type SyncingMap = Partial<Record<TeamKey, boolean>>
type FlushTimer = ReturnType<typeof setTimeout>

export function useComboTeamScores() {
  const { message } = AntdApp.useApp()
  const { teams } = useTeamCards()
  const adjustScoreMutation = useMutation(api.teams.adjustScore)
  const [comboScores, setComboScores] = useState<ComboScoresMap>({})
  const comboScoresRef = useRef<ComboScoresMap>({})
  const syncingRef = useRef<SyncingMap>({})
  const flushTimersRef = useRef<Partial<Record<TeamKey, FlushTimer>>>({})

  useEffect(() => {
    return () => {
      Object.values(flushTimersRef.current).forEach((timer) => {
        if (timer) {
          clearTimeout(timer)
        }
      })
    }
  }, [])

  function updateComboScores(nextComboScores: ComboScoresMap) {
    comboScoresRef.current = nextComboScores
    setComboScores(nextComboScores)
  }

  function cancelFlush(key: TeamKey) {
    const timer = flushTimersRef.current[key]

    if (!timer) {
      return
    }

    clearTimeout(timer)
    delete flushTimersRef.current[key]
  }

  function scheduleFlush(key: TeamKey) {
    cancelFlush(key)

    flushTimersRef.current[key] = setTimeout(() => {
      delete flushTimersRef.current[key]
      void flushScore(key)
    }, COMBO_IDLE_MS)
  }

  async function flushScore(key: TeamKey) {
    if (syncingRef.current[key]) {
      return
    }

    const comboScore = comboScoresRef.current[key] ?? 0

    if (comboScore === 0) {
      return
    }

    syncingRef.current[key] = true
    let shouldReschedule = false

    try {
      await adjustScoreMutation({ key, delta: comboScore })

      const latestComboScore = comboScoresRef.current[key] ?? 0
      const remainingComboScore = latestComboScore - comboScore
      const nextComboScores = { ...comboScoresRef.current }

      if (remainingComboScore === 0) {
        delete nextComboScores[key]
      } else {
        nextComboScores[key] = remainingComboScore
      }

      updateComboScores(nextComboScores)
      shouldReschedule = remainingComboScore !== 0
    } catch (error) {
      console.error(error)
      void message.error('Unable to update the score right now.')
    } finally {
      syncingRef.current[key] = false

      if (shouldReschedule) {
        scheduleFlush(key)
      }
    }
  }

  function queueScoreChange(key: TeamKey, delta: number) {
    const nextComboScore = (comboScoresRef.current[key] ?? 0) + delta
    const nextComboScores = { ...comboScoresRef.current }

    if (nextComboScore === 0) {
      delete nextComboScores[key]
      cancelFlush(key)
    } else {
      nextComboScores[key] = nextComboScore
      scheduleFlush(key)
    }

    updateComboScores(nextComboScores)
  }

  return {
    teams,
    comboScores,
    queueScoreChange,
  }
}
