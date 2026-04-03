import {
  AppstoreOutlined,
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Card, Typography } from 'antd'
import { HiddenItemModal } from '../features/hidden-items/components/HiddenItemModal.tsx'
import { HiddenItemsTable } from '../features/hidden-items/components/HiddenItemsTable.tsx'
import { useHiddenItems } from '../features/hidden-items/hooks/useHiddenItems.ts'

function HiddenItemsPage() {
  const navigate = useNavigate()
  const {
    hiddenItems,
    isLoading,
    deletingId,
    editingHiddenItem,
    isModalOpen,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    submitHiddenItem,
    deleteHiddenItem,
  } = useHiddenItems()

  return (
    <section className="grid gap-4 sm:gap-6">
      <header className="grid gap-5 rounded-[24px] border border-slate-900/8 bg-white/72 p-5 shadow-[0_20px_50px_rgba(148,163,184,0.16)] backdrop-blur-xl sm:rounded-[32px] sm:p-[clamp(24px,4vw,40px)] lg:grid-cols-[minmax(0,1.6fr)_auto] lg:items-end">
        <div>
          <Typography.Text className="mb-3.5 inline-block text-[0.8rem] font-bold tracking-[0.18em] text-slate-600 uppercase">
            Hidden items
          </Typography.Text>
          <Typography.Title
            className="!mb-0 max-w-[14ch] !text-[clamp(2.4rem,5vw,4rem)] !leading-[0.98] !tracking-[-0.05em] !text-slate-900 max-lg:!max-w-none"
            level={1}
          >
            Manage the hidden items list with scores and optional clues.
          </Typography.Title>
          <Typography.Paragraph className="!mt-4 !mb-0 max-w-[62ch] !text-[0.98rem] !leading-7 !text-slate-700 sm:!text-base sm:!leading-8">
            Each item stores a name, an optional description, and a score that
            can be positive or negative, together with whether it has already
            been found.
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
            Add hidden item
          </Button>
        </div>
      </header>

      <Card
        bordered={false}
        className="!rounded-[24px] !border border-slate-900/8 !bg-white/78 shadow-[0_20px_50px_rgba(148,163,184,0.16)] sm:!rounded-[28px] sm:shadow-[0_24px_60px_rgba(148,163,184,0.16)] [&_.ant-card-body]:!p-3 sm:[&_.ant-card-body]:!p-6"
      >
        <div className="mb-4 flex items-center gap-3 rounded-[18px] bg-slate-100/76 px-4 py-3 text-slate-700">
          <AppstoreOutlined className="text-[1.1rem]" />
          <Typography.Text className="!m-0 text-sm text-slate-700 sm:text-[0.95rem]">
            Hidden items can carry negative scores too, so you can model traps,
            penalties, or bonus finds in one place.
          </Typography.Text>
        </div>

        <HiddenItemsTable
          deletingId={deletingId}
          hiddenItems={hiddenItems}
          loading={isLoading}
          onDelete={deleteHiddenItem}
          onEdit={openEditModal}
        />
      </Card>

      <HiddenItemModal
        hiddenItem={editingHiddenItem}
        onCancel={closeModal}
        onSubmit={submitHiddenItem}
        open={isModalOpen}
        saving={isSaving}
      />
    </section>
  )
}

export default HiddenItemsPage
