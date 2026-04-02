import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type {
  PostureWordFormValues,
  PostureWordRecord,
} from '../postureWordTypes.ts'

export function usePostureWords() {
  const { message } = AntdApp.useApp()
  const postureWordsQuery = useQuery(
    api.postureWords.list,
  ) as PostureWordRecord[] | undefined
  const createPostureWord = useMutation(api.postureWords.create)
  const updatePostureWord = useMutation(api.postureWords.update)
  const removePostureWord = useMutation(api.postureWords.remove)
  const [editingPostureWord, setEditingPostureWord] =
    useState<PostureWordRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] =
    useState<PostureWordRecord['_id'] | null>(null)

  const postureWords = postureWordsQuery ?? []

  function openCreateModal() {
    setEditingPostureWord(null)
    setIsModalOpen(true)
  }

  function openEditModal(postureWord: PostureWordRecord) {
    setEditingPostureWord(postureWord)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingPostureWord(null)
  }

  async function submitPostureWord(values: PostureWordFormValues) {
    setIsSaving(true)

    try {
      if (editingPostureWord) {
        await updatePostureWord({
          id: editingPostureWord._id,
          english: values.english,
          vietnamese: values.vietnamese,
        })
        void message.success('Posture word updated.')
      } else {
        await createPostureWord(values)
        void message.success('Posture word added.')
      }

      closeModal()
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error
          ? error.message
          : 'Unable to save the posture word.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function deletePostureWord(postureWord: PostureWordRecord) {
    setDeletingId(postureWord._id)

    try {
      await removePostureWord({ id: postureWord._id })
      void message.success('Posture word deleted.')
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error
          ? error.message
          : 'Unable to delete the posture word.',
      )
    } finally {
      setDeletingId((currentId) =>
        currentId === postureWord._id ? null : currentId,
      )
    }
  }

  return {
    postureWords,
    isLoading: postureWordsQuery === undefined,
    deletingId,
    editingPostureWord,
    isModalOpen,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    submitPostureWord,
    deletePostureWord,
  }
}
