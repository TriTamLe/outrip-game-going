import { LeftOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Typography } from 'antd'
import { RuleModal } from '../features/rules/components/RuleModal.tsx'
import { RulesGrid } from '../features/rules/components/RulesGrid.tsx'
import { useRules } from '../features/rules/hooks/useRules.ts'

function RulesPage() {
  const navigate = useNavigate()
  const {
    rules,
    isLoading,
    deletingId,
    editingRule,
    isModalOpen,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    submitRule,
    deleteRule,
  } = useRules()

  return (
    <section className="grid gap-4 sm:gap-6">
      <header className="grid gap-5 rounded-[24px] border border-slate-900/8 bg-white/72 p-5 shadow-[0_20px_50px_rgba(148,163,184,0.16)] backdrop-blur-xl sm:rounded-[32px] sm:p-[clamp(24px,4vw,40px)] lg:grid-cols-[minmax(0,1.6fr)_auto] lg:items-end">
        <div>
          <Typography.Text className="mb-3.5 inline-block text-[0.8rem] font-bold uppercase tracking-[0.18em] text-slate-600">
            Game rules
          </Typography.Text>
          <Typography.Title
            className="!mb-0 max-w-[14ch] !text-[clamp(2.4rem,5vw,4rem)] !leading-[0.98] !tracking-[-0.05em] !text-slate-900 max-lg:!max-w-none"
            level={1}
          >
            Manage the rule sheets for each game mode.
          </Typography.Title>
          <Typography.Paragraph className="!mt-4 !mb-0 max-w-[62ch] !text-[0.98rem] !leading-7 !text-slate-700 sm:!text-base sm:!leading-8">
            Add or update the markdown instructions that should appear on the
            presentation screen whenever you switch the app into rule mode.
          </Typography.Paragraph>
        </div>

        <div className="grid gap-3 sm:flex sm:flex-wrap sm:justify-start lg:justify-end">
          <Button
            block
            className="!h-12 !rounded-2xl !px-5 !font-semibold sm:!w-auto"
            icon={<LeftOutlined />}
            onClick={() => void navigate({ to: '/' })}
            size="large"
          >
            Back to scoreboard
          </Button>
          <Button
            block
            className="!h-12 !rounded-2xl !px-5 !font-semibold sm:!w-auto"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            size="large"
            type="primary"
          >
            Add rule
          </Button>
        </div>
      </header>

      <RulesGrid
        deletingId={deletingId}
        loading={isLoading}
        onDelete={deleteRule}
        onEdit={openEditModal}
        rules={rules}
      />

      <RuleModal
        onCancel={closeModal}
        onSubmit={submitRule}
        open={isModalOpen}
        rule={editingRule}
        saving={isSaving}
      />
    </section>
  )
}

export default RulesPage
