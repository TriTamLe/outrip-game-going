import { App as AntdApp } from 'antd'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api.js'
import type {
  TeamMemberFormValues,
  TeamMemberRecord,
} from '../teamMemberTypes.ts'

export function useTeamMembers() {
  const { message } = AntdApp.useApp()
  const teamMembersQuery = useQuery(api.teamMembers.list) as
    | TeamMemberRecord[]
    | undefined
  const createTeamMember = useMutation(api.teamMembers.create)
  const updateTeamMember = useMutation(api.teamMembers.update)
  const removeTeamMember = useMutation(api.teamMembers.remove)
  const [editingTeamMember, setEditingTeamMember] =
    useState<TeamMemberRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<TeamMemberRecord['_id'] | null>(
    null,
  )

  const teamMembers = teamMembersQuery ?? []

  function openCreateModal() {
    setEditingTeamMember(null)
    setIsModalOpen(true)
  }

  function openEditModal(teamMember: TeamMemberRecord) {
    setEditingTeamMember(teamMember)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingTeamMember(null)
  }

  async function submitTeamMember(values: TeamMemberFormValues) {
    setIsSaving(true)

    try {
      if (editingTeamMember) {
        await updateTeamMember({
          id: editingTeamMember._id,
          teamKey: values.teamKey,
          name: values.name,
          isLeader: values.isLeader,
        })
        void message.success('Team member updated.')
      } else {
        await createTeamMember(values)
        void message.success('Team member added.')
      }

      closeModal()
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error
          ? error.message
          : 'Unable to save the team member.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteTeamMember(teamMember: TeamMemberRecord) {
    setDeletingId(teamMember._id)

    try {
      await removeTeamMember({ id: teamMember._id })
      void message.success('Team member deleted.')
    } catch (error) {
      console.error(error)
      void message.error(
        error instanceof Error
          ? error.message
          : 'Unable to delete the team member.',
      )
    } finally {
      setDeletingId((currentId) =>
        currentId === teamMember._id ? null : currentId,
      )
    }
  }

  return {
    teamMembers,
    isLoading: teamMembersQuery === undefined,
    deletingId,
    editingTeamMember,
    isModalOpen,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    submitTeamMember,
    deleteTeamMember,
  }
}
