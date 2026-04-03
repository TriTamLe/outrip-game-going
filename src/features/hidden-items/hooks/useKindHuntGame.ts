import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type { Id } from '../../../../convex/_generated/dataModel.js'

export function useKindHuntGame() {
  const { message } = AntdApp.useApp()
  const status = useQuery(api.globalStatus.get)
  const gameState = useQuery(api.hiddenItems.getGameState)
  const toggleSessionMutation = useMutation(api.hiddenItems.toggleSession)
  const toggleFoundMutation = useMutation(api.hiddenItems.toggleFound)
  const [isTogglingSession, setIsTogglingSession] = useState(false)
  const [updatingId, setUpdatingId] = useState<Id<'hiddenItems'> | null>(null)

  const isKindHuntActive = status?.value === 'in-game:kind-hunt'

  async function toggleKindHuntGame() {
    setIsTogglingSession(true)

    try {
      await toggleSessionMutation({})
    } catch (error) {
      console.error(error)
      void message.error(
        'Unable to toggle Cuộc Đi Săn Đầy Yêu Thương right now.',
      )
    } finally {
      setIsTogglingSession(false)
    }
  }

  async function toggleFound(id: Id<'hiddenItems'>) {
    setUpdatingId(id)

    try {
      await toggleFoundMutation({ id })
    } catch (error) {
      console.error(error)
      void message.error('Unable to update the hidden item status right now.')
    } finally {
      setUpdatingId((currentId) => (currentId === id ? null : currentId))
    }
  }

  return {
    status,
    isKindHuntActive,
    isLoading: status === undefined || gameState === undefined,
    isTogglingSession,
    updatingId,
    items: gameState?.items ?? [],
    remainingCount: gameState?.remainingCount ?? 0,
    toggleKindHuntGame,
    toggleFound,
  }
}
