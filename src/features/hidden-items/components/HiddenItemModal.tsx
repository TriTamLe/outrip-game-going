import { Form, Input, InputNumber, Modal } from 'antd'
import { useEffect } from 'react'
import type {
  HiddenItemFormValues,
  HiddenItemRecord,
} from '../hiddenItemTypes.ts'

type HiddenItemModalProps = {
  open: boolean
  hiddenItem: HiddenItemRecord | null
  saving: boolean
  onCancel: () => void
  onSubmit: (values: HiddenItemFormValues) => Promise<void>
}

export function HiddenItemModal({
  open,
  hiddenItem,
  saving,
  onCancel,
  onSubmit,
}: HiddenItemModalProps) {
  const [form] = Form.useForm<HiddenItemFormValues>()

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue(
      hiddenItem
        ? {
            name: hiddenItem.name,
            description: hiddenItem.description,
            score: hiddenItem.score,
          }
        : {
            name: '',
            description: '',
            score: 0,
          },
    )
  }, [form, hiddenItem, open])

  async function handleFinish(values: HiddenItemFormValues) {
    await onSubmit({
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      score: values.score,
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
      okText={hiddenItem ? 'Save changes' : 'Add hidden item'}
      onCancel={onCancel}
      onOk={() => void form.submit()}
      open={open}
      title={hiddenItem ? 'Edit hidden item' : 'Add hidden item'}
      width={620}
    >
      <Form
        className="mt-4 sm:mt-5"
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item<HiddenItemFormValues>
          className="!mb-4"
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Enter the hidden item name.' },
            {
              validator: async (_, value: string | undefined) => {
                if (!value?.trim()) {
                  throw new Error('Enter the hidden item name.')
                }
              },
            },
          ]}
        >
          <Input
            className="!rounded-2xl !px-4 !py-3"
            placeholder="Enter the item name"
          />
        </Form.Item>

        <Form.Item<HiddenItemFormValues>
          className="!mb-4"
          label="Description"
          name="description"
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 10 }}
            className="!rounded-2xl !px-4 !py-3"
            placeholder="Optional description"
          />
        </Form.Item>

        <Form.Item<HiddenItemFormValues>
          className="!mb-0"
          label="Score"
          name="score"
          rules={[{ required: true, message: 'Enter the score.' }]}
        >
          <InputNumber
            className="!h-12 !w-full !rounded-2xl !bg-white/90 [&_.ant-input-number-input]:!h-[46px] [&_.ant-input-number-input]:!text-base"
            placeholder="Can be negative"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
