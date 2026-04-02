import { Form, Input, Modal, Select } from 'antd'
import { useEffect } from 'react'
import {
  createDefaultIdiomStatus,
  idiomStatusOptions,
  idiomTeams,
  type IdiomFormValues,
  type IdiomRecord,
} from '../idiomStatus.ts'

type IdiomModalProps = {
  open: boolean
  idiom: IdiomRecord | null
  saving: boolean
  onCancel: () => void
  onSubmit: (values: IdiomFormValues) => Promise<void>
}

export function IdiomModal({
  open,
  idiom,
  saving,
  onCancel,
  onSubmit,
}: IdiomModalProps) {
  const [form] = Form.useForm<IdiomFormValues>()

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue(
      idiom
        ? {
            text: idiom.text,
            status: idiom.status,
          }
        : {
            text: '',
            status: createDefaultIdiomStatus(),
          },
    )
  }, [form, idiom, open])

  async function handleFinish(values: IdiomFormValues) {
    await onSubmit({
      text: values.text.trim(),
      status: values.status,
    })
  }

  return (
    <Modal
      className="[&_.ant-modal-content]:!rounded-[24px] [&_.ant-modal-content]:!p-4 [&_.ant-modal-header]:!mb-0 [&_.ant-modal-title]:!text-xl [&_.ant-modal-title]:!font-semibold sm:[&_.ant-modal-content]:!rounded-[28px] sm:[&_.ant-modal-content]:!p-6 sm:[&_.ant-modal-title]:!text-2xl"
      width={720}
      okText={idiom ? 'Save changes' : 'Add idiom'}
      onCancel={onCancel}
      onOk={() => void form.submit()}
      open={open}
      title={idiom ? 'Edit idiom' : 'Add idiom'}
      confirmLoading={saving}
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields()
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4 sm:mt-5"
      >
        <Form.Item<IdiomFormValues>
          className="!mb-4"
          label="Idiom"
          name="text"
          rules={[
            { required: true, message: 'Enter an idiom.' },
            {
              validator: async (_, value: string | undefined) => {
                if (!value?.trim()) {
                  throw new Error('Enter an idiom.')
                }
              },
            },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 5 }}
            className="!rounded-2xl !px-4 !py-3"
            placeholder="Enter the idiom text"
          />
        </Form.Item>

        {idiomTeams.map((team) => (
          <Form.Item<IdiomFormValues>
            className="!mb-4 last:!mb-0"
            key={team.key}
            label={`${team.name} status`}
            name={['status', team.key]}
            rules={[{ required: true, message: 'Select a status.' }]}
          >
            <Select
              className="[&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!px-3 [&_.ant-select-selector]:!py-2.5"
              options={idiomStatusOptions.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  )
}
