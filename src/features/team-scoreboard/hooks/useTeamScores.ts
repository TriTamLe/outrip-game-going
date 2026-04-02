import { App as AntdApp } from 'antd'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import { type TeamKey } from '../teamMeta.ts'
import { useTeamCards } from './useTeamCards.ts'

export function useTeamScores() {
  const { message } = AntdApp.useApp()
  const { teams } = useTeamCards()
  const adjustScoreMutation = useMutation(api.teams.adjustScore)
  const [submittingKey, setSubmittingKey] = useState<TeamKey | null>(null)

  async function adjustScore(key: TeamKey, delta: number) {
    setSubmittingKey(key)

    try {
      await adjustScoreMutation({ key, delta })
    } catch (error) {
      console.error(error)
      void message.error('Unable to update the score right now.')
    } finally {
      setSubmittingKey((currentKey) => (currentKey === key ? null : currentKey))
    }
  }

  return {
    teams,
    adjustScore,
    submittingKey,
  }
}
