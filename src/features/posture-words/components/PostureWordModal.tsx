import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import type {
  PostureWordFormValues,
  PostureWordRecord,
} from '../postureWordTypes.ts'

type PostureWordModalProps = {
  open: boolean
  postureWord: PostureWordRecord | null
  saving: boolean
  onCancel: () => void
  onSubmit: (values: PostureWordFormValues) => Promise<void>
}

export function PostureWordModal({
  open,
  postureWord,
  saving,
  onCancel,
  onSubmit,
}: PostureWordModalProps) {
  const [form] = Form.useForm<PostureWordFormValues>()

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue(
      postureWord
        ? {
            english: postureWord.english,
            vietnamese: postureWord.vietnamese,
          }
        : {
            english: '',
            vietnamese: '',
          },
    )
  }, [form, open, postureWord])

  async function handleFinish(values: PostureWordFormValues) {
    await onSubmit({
      english: values.english.trim(),
      vietnamese: values.vietnamese.trim(),
    })
  }

  return (
    <Modal
      className="[&_.ant-modal-content]:!rounded-[24px] [&_.ant-modal-content]:!p-4 sm:[&_.ant-modal-content]:!rounded-[28px] sm:[&_.ant-modal-content]:!p-6 [&_.ant-modal-header]:!mb-0 [&_.ant-modal-title]:!text-xl [&_.ant-modal-title]:!font-semibold sm:[&_.ant-modal-title]:!text-2xl"
      width={560}
      okText={postureWord ? 'Save changes' : 'Add posture word'}
      onCancel={onCancel}
      onOk={() => void form.submit()}
      open={open}
      title={postureWord ? 'Edit posture word' : 'Add posture word'}
      confirmLoading={saving}
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          form.resetFields()
        }
      }}
    >
      <Form
        className="mt-4 sm:mt-5"
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item<PostureWordFormValues>
          className="!mb-4"
          label="English"
          name="english"
          rules={[
            { required: true, message: 'Enter the English word.' },
            {
              validator: async (_, value: string | undefined) => {
                if (!value?.trim()) {
                  throw new Error('Enter the English word.')
                }
              },
            },
          ]}
        >
          <Input
            className="!rounded-2xl !px-4 !py-3"
            placeholder="Enter the English word"
          />
        </Form.Item>

        <Form.Item<PostureWordFormValues>
          className="!mb-0"
          label="Vietnamese"
          name="vietnamese"
          rules={[
            { required: true, message: 'Enter the Vietnamese word.' },
            {
              validator: async (_, value: string | undefined) => {
                if (!value?.trim()) {
                  throw new Error('Enter the Vietnamese word.')
                }
              },
            },
          ]}
        >
          <Input
            className="!rounded-2xl !px-4 !py-3"
            placeholder="Enter the Vietnamese word"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
