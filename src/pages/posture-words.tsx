import { LeftOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from '@tanstack/react-router'
import { Button, Card, Typography } from 'antd'
import { PostureWordModal } from '../features/posture-words/components/PostureWordModal.tsx'
import { PostureWordsTable } from '../features/posture-words/components/PostureWordsTable.tsx'
import { usePostureWords } from '../features/posture-words/hooks/usePostureWords.ts'

function PostureWordsPage() {
  const navigate = useNavigate()
  const {
    postureWords,
    isLoading,
    deletingId,
    editingPostureWord,
    isModalOpen,
    isSaving,
    openCreateModal,
    openEditModal,
    closeModal,
    submitPostureWord,
    deletePostureWord,
  } = usePostureWords()

  return (
    <section className="grid gap-6">
      <header className="grid gap-6 rounded-[32px] border border-slate-900/8 bg-white/72 p-[clamp(24px,4vw,40px)] shadow-[0_24px_60px_rgba(148,163,184,0.16)] backdrop-blur-xl lg:grid-cols-[minmax(0,1.6fr)_auto] lg:items-end">
        <div>
          <Typography.Text className="mb-3.5 inline-block text-[0.8rem] font-bold uppercase tracking-[0.18em] text-slate-600">
            Posture words
          </Typography.Text>
          <Typography.Title
            className="!mb-0 max-w-[14ch] !text-[clamp(2.4rem,5vw,4rem)] !leading-[0.98] !tracking-[-0.05em] !text-slate-900 max-lg:!max-w-none"
            level={1}
          >
            Manage the bilingual posture word list.
          </Typography.Title>
          <Typography.Paragraph className="!mt-4 !mb-0 max-w-[62ch] !text-base !leading-8 !text-slate-700">
            Each entry stores a simple English word together with its
            Vietnamese version. Add new words, refine translations, or remove
            the ones you no longer need.
          </Typography.Paragraph>
        </div>

        <div className="flex flex-wrap justify-end gap-3 max-lg:justify-start">
          <Button
            className="!h-12 !rounded-2xl !px-5 !font-semibold"
            icon={<LeftOutlined />}
            onClick={() => void navigate({ to: '/' })}
            size="large"
          >
            Back to scoreboard
          </Button>
          <Button
            className="!h-12 !rounded-2xl !px-5 !font-semibold"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
            size="large"
            type="primary"
          >
            Add posture word
          </Button>
        </div>
      </header>

      <Card
        bordered={false}
        className="!rounded-[28px] !border border-slate-900/8 !bg-white/78 shadow-[0_24px_60px_rgba(148,163,184,0.16)]"
      >
        <PostureWordsTable
          deletingId={deletingId}
          loading={isLoading}
          onDelete={deletePostureWord}
          onEdit={openEditModal}
          postureWords={postureWords}
        />
      </Card>

      <PostureWordModal
        onCancel={closeModal}
        onSubmit={submitPostureWord}
        open={isModalOpen}
        postureWord={editingPostureWord}
        saving={isSaving}
      />
    </section>
  )
}

export default PostureWordsPage
