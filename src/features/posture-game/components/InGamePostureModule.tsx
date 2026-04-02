import { Typography } from 'antd'
import type { Id } from '../../../../convex/_generated/dataModel.js'
import type { PostureWordRecord } from '../../posture-words/postureWordTypes.ts'

type InGamePostureModuleProps = {
  activeWord: PostureWordRecord | null
  words: PostureWordRecord[]
  phase: 'waiting' | 'playing' | 'result' | null
  disabled?: boolean
  onSelectWord: (id: Id<'postureWords'>) => Promise<void> | void
  onClearActiveWord: () => Promise<void> | void
}

const phaseCopy = {
  waiting: 'Waiting for a word',
  playing: 'Word is live',
  result: 'Showing result',
} as const

export function InGamePostureModule({
  activeWord,
  words,
  phase,
  disabled = false,
  onSelectWord,
  onClearActiveWord,
}: InGamePostureModuleProps) {
  return (
    <section className="grid gap-4 rounded-[28px] border border-slate-900/8 bg-white/84 p-5 shadow-[0_20px_40px_rgba(148,163,184,0.14)] backdrop-blur-xl">
      <div className="grid gap-1">
        <Typography.Text className="!m-0 !text-[0.72rem] !font-bold !tracking-[0.18em] !text-slate-500 !uppercase">
          In-Game Posture
        </Typography.Text>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Typography.Title
            className="!mb-0 !text-[1.2rem] !font-semibold !text-slate-900"
            level={4}
          >
            Tâm Đầu Ý Hợp
          </Typography.Title>
          {phase ? (
            <Typography.Text className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {phaseCopy[phase]}
            </Typography.Text>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2.5">
          <Typography.Text className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Active Word
          </Typography.Text>
          <button
            className={`grid min-h-[92px] rounded-[18px] border px-3 py-2.5 text-center transition ${
              activeWord
                ? 'border-slate-900/10 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]'
                : 'border-dashed border-slate-300 bg-slate-100/70 text-slate-400'
            }`}
            disabled={!activeWord || disabled}
            onClick={() => void onClearActiveWord()}
            type="button"
          >
            {activeWord ? (
              <div className="grid content-center gap-0.5 self-stretch">
                <span className="text-[1.02rem] leading-tight font-semibold text-white">
                  {activeWord.english}
                </span>
                <span className="text-xs text-white/72">
                  {activeWord.vietnamese}
                </span>
              </div>
            ) : (
              <div className="grid gap-1">
                <span className="text-sm font-medium text-slate-500">
                  No active word
                </span>
                <span className="text-xs text-slate-400">
                  Pick one from the list.
                </span>
              </div>
            )}
          </button>
        </div>

        <div className="grid gap-2.5">
          <Typography.Text className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            List Word
          </Typography.Text>
          <div className="max-h-[320px] overflow-y-auto overscroll-y-contain pr-1">
            <div className="grid grid-cols-2 gap-3">
              {words.map((word) => {
                const isActive = activeWord?._id === word._id

                return (
                  <button
                    className={`grid min-h-[88px] rounded-[20px] border px-3.5 py-3 text-left transition active:scale-90 ${
                      isActive
                        ? 'border-slate-300 bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
                        : 'border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white'
                    }`}
                    disabled={disabled}
                    key={word._id}
                    onClick={() => void onSelectWord(word._id)}
                    type="button"
                  >
                    <span className="text-base leading-tight font-semibold text-slate-900">
                      {word.english}
                    </span>
                    <span className="pt-0.5 text-xs text-slate-500">
                      {word.vietnamese}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
