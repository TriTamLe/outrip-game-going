import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type { IdiomFormValues, IdiomRecord } from '../idiomStatus.ts'

export function useIdioms() {
  const { message, modal } = AntdApp.useApp()
  const idiomsQuery = useQuery(api.idioms.list) as IdiomRecord[] | undefined
  const createIdiom = useMutation(api.idioms.create)
  const updateIdiom = useMutation(api.idioms.update)
  const removeIdiom = useMutation(api.idioms.remove)
  const resetAllStatusesMutation = useMutation(api.idioms.resetAllStatuses)
  const [editingIdiom, setEditingIdiom] = useState<IdiomRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<IdiomRecord['_id'] | null>(null)
  const [isResettingStatuses, setIsResettingStatuses] = useState(false)

  const idioms = idiomsQuery ?? []

  function openCreateModal() {
    setEditingIdiom(null)
    setIsModalOpen(true)
  }

  function openEditModal(idiom: IdiomRecord) {
    setEditingIdiom(idiom)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingIdiom(null)
  }

  async function submitIdiom(values: IdiomFormValues) {
    setIsSaving(true)

    try {
      if (editingIdiom) {
        await updateIdiom({
          id: editingIdiom._id,
          text: values.text,
          status: values.status,
        })
        void message.success('Idiom updated.')
      } else {
        await createIdiom(values)
        void message.success('Idiom added.')
      }

      closeModal()
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error ? error.message : 'Unable to save the idiom.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteIdiom(idiom: IdiomRecord) {
    setDeletingId(idiom._id)

    try {
      await removeIdiom({ id: idiom._id })
      void message.success('Idiom deleted.')
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error ? error.message : 'Unable to delete the idiom.',
      )
    } finally {
      setDeletingId((currentId) => (currentId === idiom._id ? null : currentId))
    }
  }

  function resetAllStatuses() {
    void modal.confirm({
      centered: true,
      okButtonProps: { danger: true },
      okText: 'Reset statuses',
      title: 'Reset every idiom status?',
      content:
        'All team statuses for every idiom will be set back to not-displayed.',
      onOk: async () => {
        setIsResettingStatuses(true)

        try {
          const result = await resetAllStatusesMutation({})
          void message.success(
            `Reset statuses for ${result.updated}/${result.total} idioms.`,
          )
        } catch (error) {
          console.error(error)
          void message.error(
            error instanceof Error
              ? error.message
              : 'Unable to reset idiom statuses.',
          )
        } finally {
          setIsResettingStatuses(false)
        }
      },
    })
  }

  return {
    idioms,
    isLoading: idiomsQuery === undefined,
    deletingId,
    editingIdiom,
    isModalOpen,
    isSaving,
    isResettingStatuses,
    openCreateModal,
    openEditModal,
    closeModal,
    submitIdiom,
    deleteIdiom,
    resetAllStatuses,
  }
}
