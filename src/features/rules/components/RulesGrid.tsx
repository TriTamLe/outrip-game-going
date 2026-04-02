import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Typography } from 'antd'
import { ruleMetaByKey } from '../ruleMeta.ts'
import type { RuleRecord } from '../ruleTypes.ts'
import { RuleMarkdown } from './RuleMarkdown.tsx'

type RulesGridProps = {
  rules: RuleRecord[]
  loading: boolean
  deletingId: RuleRecord['_id'] | null
  onEdit: (rule: RuleRecord) => void
  onDelete: (rule: RuleRecord) => Promise<void>
}

export function RulesGrid({
  rules,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: RulesGridProps) {
  if (!loading && rules.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-10 text-center text-sm text-slate-500">
        No rules yet. Add one for each game.
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rules.map((rule) => (
        <article
          className="grid gap-4 rounded-[24px] border border-slate-200/80 bg-white/72 p-5 shadow-[0_14px_34px_rgba(148,163,184,0.12)]"
          key={rule._id}
        >
          <div className="grid gap-2">
            <Typography.Text className="text-[0.72rem] font-bold tracking-[0.18em] text-slate-500 uppercase">
              Game rule
            </Typography.Text>
            <Typography.Title
              className="!mb-0 !text-[1.5rem] !leading-tight !text-slate-900"
              level={3}
            >
              {ruleMetaByKey[rule.game].name}
            </Typography.Title>
          </div>

          <div className="rounded-[18px] bg-slate-100/82 px-4 py-4 sm:px-5 sm:py-5">
            <RuleMarkdown markdown={rule.markdown} />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              className="!h-11 !rounded-2xl !font-medium"
              icon={<EditOutlined />}
              onClick={() => onEdit(rule)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete this rule?"
              okButtonProps={{ danger: true }}
              okText="Delete"
              onConfirm={() => onDelete(rule)}
            >
              <Button
                className="!h-11 !rounded-2xl !font-medium"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === rule._id}
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        </article>
      ))}
    </div>
  )
}
