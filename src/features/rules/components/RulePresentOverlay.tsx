import { Typography } from 'antd'
import { ruleMetaByKey, type RuleGameKey } from '../ruleMeta.ts'
import { RuleMarkdown } from './RuleMarkdown.tsx'

type RulePresentOverlayProps = {
  game: RuleGameKey
  markdown?: string | null
}

export function RulePresentOverlay({
  game,
  markdown = null,
}: RulePresentOverlayProps) {
  const gameMeta = ruleMetaByKey[game]

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center p-6 sm:p-8">
      <div className="absolute inset-0 bg-slate-950/22 backdrop-blur-[2px]" />
      <section className="relative grid max-h-[calc(100svh-48px)] w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/75 bg-white/97 shadow-[0_48px_140px_rgba(15,23,42,0.32)]">
        <div className="grid gap-6 overflow-y-auto px-6 py-7 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="grid gap-2 text-center">
            <Typography.Title
              className="!mb-0 !text-[clamp(2rem,5vw,3rem)] !leading-[0.96] !tracking-[-0.05em] !text-slate-950"
              level={1}
            >
              {gameMeta.name}
            </Typography.Title>
          </div>

          <div className="rounded-[28px] bg-slate-100/82 px-5 py-5 sm:px-7 sm:py-7">
            <RuleMarkdown markdown={markdown} variant="present" />
          </div>
        </div>
      </section>
    </div>
  )
}
