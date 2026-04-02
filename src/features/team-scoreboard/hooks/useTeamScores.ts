import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import { teamMeta, type TeamCard, type TeamKey } from '../teamMeta.ts'

export function useTeamScores() {
  const { message } = AntdApp.useApp()
  const teamScores = useQuery(api.teams.list)
  const adjustScoreMutation = useMutation(api.teams.adjustScore)
  const [submittingKey, setSubmittingKey] = useState<TeamKey | null>(null)

  const scoresByKey = new Map(
    (teamScores ?? []).map((team) => [team.key, team.score] as const),
  )

  const teams: TeamCard[] = teamMeta.map((team) => ({
    ...team,
    score: teamScores === undefined ? null : (scoresByKey.get(team.key) ?? 0),
  }))

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
