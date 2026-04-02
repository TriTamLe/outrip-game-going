import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type { RuleFormValues, RuleRecord } from '../ruleTypes.ts'

export function useRules() {
  const { message } = AntdApp.useApp()
  const rulesQuery = useQuery(api.rules.list) as RuleRecord[] | undefined
  const createRule = useMutation(api.rules.create)
  const updateRule = useMutation(api.rules.update)
  const removeRule = useMutation(api.rules.remove)
  const [editingRule, setEditingRule] = useState<RuleRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<RuleRecord['_id'] | null>(null)

  const rules = rulesQuery ?? []

  function openCreateModal() {
    setEditingRule(null)
    setIsModalOpen(true)
  }

  function openEditModal(rule: RuleRecord) {
    setEditingRule(rule)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingRule(null)
  }

  async function submitRule(values: RuleFormValues) {
    setIsSaving(true)

    try {
      if (editingRule) {
        await updateRule({
          id: editingRule._id,
          game: values.game,
          markdown: values.markdown,
        })
        void message.success('Rule updated.')
      } else {
        await createRule(values)
        void message.success('Rule added.')
      }

      closeModal()
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error ? error.message : 'Unable to save the rule.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteRule(rule: RuleRecord) {
    setDeletingId(rule._id)

    try {
      await removeRule({ id: rule._id })
      void message.success('Rule deleted.')
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error ? error.message : 'Unable to delete the rule.',
      )
    } finally {
      setDeletingId((currentId) => (currentId === rule._id ? null : currentId))
    }
  }

  return {
    rules,
    isLoading: rulesQuery === undefined,
    deletingId,
    editingRule,
    isModalOpen,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    submitRule,
    deleteRule,
  }
}
