import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'

export function useVienameseSettings() {
  const { message } = AntdApp.useApp()
  const settings = useQuery(api.vienameseGame.getSettings)
  const setDurationMinutesMutation = useMutation(
    api.vienameseGame.setDurationMinutes,
  )
  const [isSaving, setIsSaving] = useState(false)

  async function setDurationMinutes(minutes: number) {
    setIsSaving(true)

    try {
      await setDurationMinutesMutation({ minutes })
    } catch (error) {
      console.error(error)
      void message.error('Unable to update the round duration right now.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    durationMinutes: settings?.durationMinutes ?? 5,
    isLoading: settings === undefined,
    isSaving,
    setDurationMinutes,
  }
}
