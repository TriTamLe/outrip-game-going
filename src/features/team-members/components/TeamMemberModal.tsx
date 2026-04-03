import { Checkbox, Form, Input, Modal, Select } from 'antd'
import { useEffect } from 'react'
import { teamMeta } from '../../team-scoreboard/teamMeta.ts'
import type {
  TeamMemberFormValues,
  TeamMemberRecord,
} from '../teamMemberTypes.ts'

type TeamMemberModalProps = {
  open: boolean
  teamMember: TeamMemberRecord | null
  saving: boolean
  onCancel: () => void
  onSubmit: (values: TeamMemberFormValues) => Promise<void>
}

export function TeamMemberModal({
  open,
  teamMember,
  saving,
  onCancel,
  onSubmit,
}: TeamMemberModalProps) {
  const [form] = Form.useForm<TeamMemberFormValues>()

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue(
      teamMember
        ? {
            teamKey: teamMember.teamKey,
            name: teamMember.name,
            isLeader: teamMember.isLeader,
          }
        : {
            teamKey: undefined,
            name: '',
            isLeader: false,
          },
    )
  }, [form, open, teamMember])

  async function handleFinish(values: TeamMemberFormValues) {
    await onSubmit({
      teamKey: values.teamKey,
      name: values.name.trim(),
      isLeader: values.isLeader,
    })
  }

  return (
    <Modal
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields()
        }
      }}
      className="[&_.ant-modal-content]:!rounded-[24px] [&_.ant-modal-content]:!p-4 sm:[&_.ant-modal-content]:!rounded-[28px] sm:[&_.ant-modal-content]:!p-6 [&_.ant-modal-header]:!mb-0 [&_.ant-modal-title]:!text-xl [&_.ant-modal-title]:!font-semibold sm:[&_.ant-modal-title]:!text-2xl"
      confirmLoading={saving}
      okText={teamMember ? 'Save changes' : 'Add member'}
      onCancel={onCancel}
      onOk={() => void form.submit()}
      open={open}
      title={teamMember ? 'Edit team member' : 'Add team member'}
      width={560}
    >
      <Form
        className="mt-4 sm:mt-5"
        form={form}
        initialValues={{ isLeader: false }}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item<TeamMemberFormValues>
          className="!mb-4"
          label="Team"
          name="teamKey"
          rules={[{ required: true, message: 'Select a team.' }]}
        >
          <Select
            className="[&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!px-3 [&_.ant-select-selector]:!py-2.5"
            options={teamMeta.map((team) => ({
              value: team.key,
              label: team.name,
            }))}
            placeholder="Choose a team"
          />
        </Form.Item>

        <Form.Item<TeamMemberFormValues>
          className="!mb-4"
          label="Member name"
          name="name"
          rules={[
            { required: true, message: 'Enter the member name.' },
            {
              validator: async (_, value: string | undefined) => {
                if (!value?.trim()) {
                  throw new Error('Enter the member name.')
                }
              },
            },
          ]}
        >
          <Input
            className="!rounded-2xl !px-4 !py-3"
            placeholder="Enter the member name"
          />
        </Form.Item>

        <Form.Item<TeamMemberFormValues>
          className="!mb-0"
          name="isLeader"
          valuePropName="checked"
        >
          <Checkbox className="text-sm text-slate-700">
            Mark this member as team leader
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}
