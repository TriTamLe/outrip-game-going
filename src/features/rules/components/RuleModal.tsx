import { Form, Input, Modal, Select, Typography } from 'antd'
import { useEffect } from 'react'
import { ruleGames } from '../ruleMeta.ts'
import type { RuleFormValues, RuleRecord } from '../ruleTypes.ts'
import { RuleMarkdown } from './RuleMarkdown.tsx'

type RuleModalProps = {
  open: boolean
  rule: RuleRecord | null
  saving: boolean
  onCancel: () => void
  onSubmit: (values: RuleFormValues) => Promise<void>
}

export function RuleModal({
  open,
  rule,
  saving,
  onCancel,
  onSubmit,
}: RuleModalProps) {
  const [form] = Form.useForm<RuleFormValues>()
  const markdownPreview = Form.useWatch('markdown', form)

  useEffect(() => {
    if (!open) {
      return
    }

    form.setFieldsValue(
      rule
        ? {
            game: rule.game,
            markdown: rule.markdown,
          }
        : {
            game: undefined,
            markdown: '',
          },
    )
  }, [form, open, rule])

  async function handleFinish(values: RuleFormValues) {
    await onSubmit({
      game: values.game,
      markdown: values.markdown.trim(),
    })
  }

  return (
    <Modal
      className="[&_.ant-modal-content]:!rounded-[24px] [&_.ant-modal-content]:!p-4 sm:[&_.ant-modal-content]:!rounded-[28px] sm:[&_.ant-modal-content]:!p-6 [&_.ant-modal-header]:!mb-0 [&_.ant-modal-title]:!text-xl [&_.ant-modal-title]:!font-semibold sm:[&_.ant-modal-title]:!text-2xl"
      width={760}
      okText={rule ? 'Save changes' : 'Add rule'}
      onCancel={onCancel}
      onOk={() => void form.submit()}
      open={open}
      title={rule ? 'Edit game rule' : 'Add game rule'}
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
        <Form.Item<RuleFormValues>
          className="!mb-4"
          label="Game"
          name="game"
          rules={[{ required: true, message: 'Select a game.' }]}
        >
          <Select
            className="[&_.ant-select-selector]:!rounded-2xl [&_.ant-select-selector]:!px-3 [&_.ant-select-selector]:!py-2.5"
            options={ruleGames.map((game) => ({
              value: game.key,
              label: game.name,
            }))}
            placeholder="Choose a game"
          />
        </Form.Item>

        <Form.Item<RuleFormValues>
          className="!mb-0"
          label="Rule markdown"
          name="markdown"
          rules={[
            { required: true, message: 'Enter the rule markdown.' },
            {
              validator: async (_, value: string | undefined) => {
                if (!value?.trim()) {
                  throw new Error('Enter the rule markdown.')
                }
              },
            },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 8, maxRows: 18 }}
            className="!rounded-2xl !px-4 !py-3"
            placeholder="Write the game rules in markdown"
          />
        </Form.Item>

        <div className="mt-5 grid gap-3">
          <Typography.Text className="text-[0.76rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
            Preview
          </Typography.Text>
          <div className="max-h-[320px] overflow-y-auto rounded-[22px] border border-slate-200/80 bg-slate-50/88 px-4 py-4 sm:px-5 sm:py-5">
            <RuleMarkdown
              emptyText="Markdown preview will appear here."
              markdown={markdownPreview}
            />
          </div>
        </div>
      </Form>
    </Modal>
  )
}
