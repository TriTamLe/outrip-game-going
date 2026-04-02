import { Typography } from 'antd'
import type { PostureWordRecord } from '../../posture-words/postureWordTypes.ts'

type PosturePresentOverlayProps = {
  word: PostureWordRecord
}

export function PosturePresentOverlay({ word }: PosturePresentOverlayProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-slate-950/18 backdrop-blur-[2px]" />
      <section className="relative grid w-full max-w-6xl gap-5 rounded-[52px] border border-white/75 bg-white/96 px-12 py-14 text-center shadow-[0_48px_140px_rgba(15,23,42,0.3)] sm:px-16 sm:py-20">
        <Typography.Title
          className="!mb-0 !text-[clamp(5.4rem,13vw,10.5rem)] !leading-[0.9] !tracking-[-0.065em] !text-slate-950"
          level={1}
        >
          {word.english}
        </Typography.Title>
        <Typography.Text className="text-[clamp(3.6rem,8.6vw,7rem)] font-medium leading-[0.95] text-slate-500">
          {word.vietnamese}
        </Typography.Text>
      </section>
    </div>
  )
}
