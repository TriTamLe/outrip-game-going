import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import {
  ruleMetaByKey,
  ruleMetaByStatus,
  type RuleGameKey,
  type RuleStatusValue,
} from '../ruleMeta.ts'
import type { RuleRecord } from '../ruleTypes.ts'

export function useRuleStatus() {
  const { message } = AntdApp.useApp()
  const status = useQuery(api.globalStatus.get)
  const rules = (useQuery(api.rules.list) as RuleRecord[] | undefined) ?? []
  const toggleRuleMutation = useMutation(api.globalStatus.toggleRule)
  const [togglingRuleKey, setTogglingRuleKey] = useState<RuleGameKey | null>(
    null,
  )

  const activeRuleStatus =
    status?.value && status.value.startsWith('rule:')
      ? (status.value as RuleStatusValue)
      : null
  const activeRuleGame = activeRuleStatus
    ? ruleMetaByStatus[activeRuleStatus as RuleStatusValue].key
    : null
  const activeRule = activeRuleGame
    ? (rules.find((rule) => rule.game === activeRuleGame) ?? null)
    : null
  const isRuleMode = activeRuleGame !== null

  async function toggleRule(game: RuleGameKey) {
    setTogglingRuleKey(game)

    try {
      await toggleRuleMutation({ game })
    } catch (error) {
      console.error(error)
      void message.error(
        `Unable to toggle rules for ${ruleMetaByKey[game].name} right now.`,
      )
    } finally {
      setTogglingRuleKey((currentKey) =>
        currentKey === game ? null : currentKey,
      )
    }
  }

  return {
    status,
    isLoading: status === undefined,
    isRuleMode,
    activeRuleGame,
    activeRule,
    togglingRuleKey,
    toggleRule,
  }
}
