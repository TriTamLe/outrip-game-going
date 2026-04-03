import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type {
  HiddenItemFormValues,
  HiddenItemRecord,
} from '../hiddenItemTypes.ts'

export function useHiddenItems() {
  const { message } = AntdApp.useApp()
  const hiddenItemsQuery = useQuery(api.hiddenItems.list) as
    | HiddenItemRecord[]
    | undefined
  const createHiddenItem = useMutation(api.hiddenItems.create)
  const updateHiddenItem = useMutation(api.hiddenItems.update)
  const removeHiddenItem = useMutation(api.hiddenItems.remove)
  const [editingHiddenItem, setEditingHiddenItem] =
    useState<HiddenItemRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<HiddenItemRecord['_id'] | null>(
    null,
  )

  const hiddenItems = hiddenItemsQuery ?? []

  function openCreateModal() {
    setEditingHiddenItem(null)
    setIsModalOpen(true)
  }

  function openEditModal(hiddenItem: HiddenItemRecord) {
    setEditingHiddenItem(hiddenItem)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingHiddenItem(null)
  }

  async function submitHiddenItem(values: HiddenItemFormValues) {
    setIsSaving(true)

    try {
      if (editingHiddenItem) {
        await updateHiddenItem({
          id: editingHiddenItem._id,
          name: values.name,
          description: values.description,
          score: values.score,
        })
        void message.success('Hidden item updated.')
      } else {
        await createHiddenItem(values)
        void message.success('Hidden item added.')
      }

      closeModal()
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error
          ? error.message
          : 'Unable to save the hidden item.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteHiddenItem(hiddenItem: HiddenItemRecord) {
    setDeletingId(hiddenItem._id)

    try {
      await removeHiddenItem({ id: hiddenItem._id })
      void message.success('Hidden item deleted.')
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error
          ? error.message
          : 'Unable to delete the hidden item.',
      )
    } finally {
      setDeletingId((currentId) =>
        currentId === hiddenItem._id ? null : currentId,
      )
    }
  }

  return {
    hiddenItems,
    isLoading: hiddenItemsQuery === undefined,
    deletingId,
    editingHiddenItem,
    isModalOpen,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    submitHiddenItem,
    deleteHiddenItem,
  }
}
