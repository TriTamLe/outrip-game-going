import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type { Id } from '../../../../convex/_generated/dataModel.js'

export function usePostureGame() {
  const { message } = AntdApp.useApp()
  const status = useQuery(api.globalStatus.get)
  const postureState = useQuery(api.postureGame.getState)
  const toggleSessionMutation = useMutation(api.postureGame.toggleSession)
  const setActiveWordMutation = useMutation(api.postureGame.setActiveWord)
  const clearActiveWordMutation = useMutation(api.postureGame.clearActiveWord)
  const toggleMembersOnPresentMutation = useMutation(
    api.postureGame.toggleMembersOnPresent,
  )
  const [isToggling, setIsToggling] = useState(false)
  const [isUpdatingWord, setIsUpdatingWord] = useState(false)
  const [isTogglingMembers, setIsTogglingMembers] = useState(false)

  const isPostureActive = status?.value === 'in-game:posture'

  async function togglePostureGame() {
    setIsToggling(true)

    try {
      await toggleSessionMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to toggle Tâm Đầu Ý Hợp right now.')
    } finally {
      setIsToggling(false)
    }
  }

  async function selectActiveWord(id: Id<'postureWords'>) {
    setIsUpdatingWord(true)

    try {
      await setActiveWordMutation({ id })
    } catch (error) {
      console.error(error)
      void message.error('Unable to set the active word right now.')
    } finally {
      setIsUpdatingWord(false)
    }
  }

  async function clearActiveWord() {
    setIsUpdatingWord(true)

    try {
      await clearActiveWordMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to clear the active word right now.')
    } finally {
      setIsUpdatingWord(false)
    }
  }

  async function toggleMembersOnPresent() {
    setIsTogglingMembers(true)

    try {
      await toggleMembersOnPresentMutation({})
    } catch (error) {
      console.error(error)
      void message.error('Unable to update present member visibility right now.')
    } finally {
      setIsTogglingMembers(false)
    }
  }

  return {
    status,
    phase: isPostureActive ? status.phase : null,
    isPostureActive,
    isLoading: status === undefined || postureState === undefined,
    isToggling,
    isUpdatingWord,
    isTogglingMembers,
    activeWord: postureState?.activeWord ?? null,
    showMembersOnPresent: postureState?.showMembersOnPresent ?? true,
    words: postureState?.words ?? [],
    togglePostureGame,
    selectActiveWord,
    clearActiveWord,
    toggleMembersOnPresent,
  }
}
