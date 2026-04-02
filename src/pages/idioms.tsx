import { LeftOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Card, InputNumber, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { IdiomModal } from '../features/idioms/components/IdiomModal.tsx'
import { IdiomsTable } from '../features/idioms/components/IdiomsTable.tsx'
import { useIdioms } from '../features/idioms/hooks/useIdioms.ts'
import { useVienameseSettings } from '../features/vienamese-game/hooks/useVienameseSettings.ts'

function IdiomsPage() {
  const navigate = useNavigate()
  const {
    idioms,
    isLoading,
    deletingId,
    editingIdiom,
    isModalOpen,
    isSaving,
    isResettingStatuses,
    openCreateModal,
    openEditModal,
    closeModal,
    submitIdiom,
    deleteIdiom,
    resetAllStatuses,
  } = useIdioms()
  const {
    durationMinutes,
    isLoading: isLoadingVienameseSettings,
    isSaving: isSavingVienameseSettings,
    setDurationMinutes,
  } = useVienameseSettings()
  const [durationInput, setDurationInput] = useState(durationMinutes)

  useEffect(() => {
    setDurationInput(durationMinutes)
  }, [durationMinutes])

  return (
    <section className="grid gap-4 sm:gap-6">
      <header className="grid gap-5 rounded-[24px] border border-slate-900/8 bg-white/72 p-5 shadow-[0_20px_50px_rgba(148,163,184,0.16)] backdrop-blur-xl sm:rounded-[32px] sm:p-[clamp(24px,4vw,40px)] lg:grid-cols-[minmax(0,1.6fr)_auto] lg:items-end">
        <div>
          <Typography.Text className="mb-3.5 inline-block text-[0.8rem] font-bold uppercase tracking-[0.18em] text-slate-600">
            Idiom library
          </Typography.Text>
          <Typography.Title
            className="!mb-0 max-w-[14ch] !text-[clamp(2.4rem,5vw,4rem)] !leading-[0.98] !tracking-[-0.05em] !text-slate-900 max-lg:!max-w-none"
            level={1}
          >
            Browse, edit, and grow the team idiom list.
          </Typography.Title>
          <Typography.Paragraph className="!mt-4 !mb-0 max-w-[62ch] !text-[0.98rem] !leading-7 !text-slate-700 sm:!text-base sm:!leading-8">
            Every idiom keeps a status for Kindness, One-Team, Excellence, and
            Sustainability. You can add new idioms, refine existing ones, or
            remove entries that are no longer useful.
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
            icon={<ReloadOutlined />}
            loading={isResettingStatuses}
            onClick={resetAllStatuses}
            size="large"
          >
            Reset idiom statuses
          </Button>
          <Button
            block
            className="!h-12 !rounded-2xl !px-5 !font-semibold sm:!w-auto"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            size="large"
            type="primary"
          >
            Add idiom
          </Button>
        </div>
      </header>

      <Card
        bordered={false}
        className="!rounded-[24px] !border border-slate-900/8 !bg-white/78 shadow-[0_20px_50px_rgba(148,163,184,0.16)] sm:!rounded-[28px] sm:shadow-[0_24px_60px_rgba(148,163,184,0.16)] [&_.ant-card-body]:!p-4 sm:[&_.ant-card-body]:!p-6"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="grid gap-2">
            <Typography.Text className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-slate-500">
              Tiếng Tây Tiếng Ta
            </Typography.Text>
            <Typography.Title
              className="!mb-0 !text-[1.5rem] !leading-tight !text-slate-900"
              level={3}
            >
              Round duration
            </Typography.Title>
            <Typography.Text className="text-sm text-slate-600">
              Set how many minutes each team gets when playing TTTT.
            </Typography.Text>
          </div>

          <div className="grid gap-2 sm:grid-cols-[160px_auto]">
            <InputNumber
              className="!h-12 !w-full !rounded-2xl !bg-white/90 [&_.ant-input-number-input]:!h-[46px] [&_.ant-input-number-input]:!text-base"
              controls={false}
              disabled={isLoadingVienameseSettings}
              max={60}
              min={1}
              onChange={(value) =>
                setDurationInput(
                  typeof value === 'number' && Number.isFinite(value)
                    ? value
                    : durationMinutes,
                )
              }
              placeholder="Minutes"
              value={durationInput}
            />
            <Button
              block
              className="!h-12 !rounded-2xl !px-5 !font-semibold sm:!w-auto"
              disabled={
                isLoadingVienameseSettings || durationInput === durationMinutes
              }
              loading={isSavingVienameseSettings}
              onClick={() => void setDurationMinutes(durationInput)}
              type="primary"
            >
              Save duration
            </Button>
          </div>
        </div>
      </Card>

      <Card
        bordered={false}
        className="!rounded-[24px] !border border-slate-900/8 !bg-white/78 shadow-[0_20px_50px_rgba(148,163,184,0.16)] sm:!rounded-[28px] sm:shadow-[0_24px_60px_rgba(148,163,184,0.16)] [&_.ant-card-body]:!p-3 sm:[&_.ant-card-body]:!p-6"
      >
        <IdiomsTable
          deletingId={deletingId}
          idioms={idioms}
          loading={isLoading}
          onDelete={deleteIdiom}
          onEdit={openEditModal}
        />
      </Card>

      <IdiomModal
        idiom={editingIdiom}
        onCancel={closeModal}
        onSubmit={submitIdiom}
        open={isModalOpen}
        saving={isSaving}
      />
    </section>
  )
}

export default IdiomsPage
