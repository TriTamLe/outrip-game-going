import { Typography } from 'antd'
import type { Id } from '../../../../convex/_generated/dataModel.js'
import type { HiddenItemRecord } from '../hiddenItemTypes.ts'

type InGameKindHuntModuleProps = {
  items: HiddenItemRecord[]
  remainingCount: number
  disabled?: boolean
  updatingId?: Id<'hiddenItems'> | null
  onToggleFound: (id: Id<'hiddenItems'>) => Promise<void> | void
}

export function InGameKindHuntModule({
  items,
  remainingCount,
  disabled = false,
  updatingId = null,
  onToggleFound,
}: InGameKindHuntModuleProps) {
  return (
    <section className="grid gap-4 rounded-[28px] border border-slate-900/8 bg-white/84 p-5 shadow-[0_20px_40px_rgba(148,163,184,0.14)] backdrop-blur-xl">
      <div className="grid gap-1">
        <Typography.Text className="!m-0 !text-[0.72rem] !font-bold !tracking-[0.18em] !text-slate-500 !uppercase">
          In-Game Kind Hunt
        </Typography.Text>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Typography.Title
            className="!mb-0 !text-[1.2rem] !font-semibold !text-slate-900"
            level={4}
          >
            Cuộc Đi Săn Đầy Yêu Thương
          </Typography.Title>
          <Typography.Text className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {remainingCount} items left
          </Typography.Text>
        </div>
      </div>

      <div className="max-h-[360px] overflow-y-auto overscroll-y-contain pr-1">
        <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
          {items.map((item) => {
            const isUpdating = updatingId === item._id

            return (
              <button
                className={`grid min-h-[110px] rounded-[20px] border px-3.5 py-3 text-left transition active:scale-90 ${
                  item.isFound
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
                    : 'border-slate-200 bg-white/90 text-slate-900 hover:border-slate-300 hover:bg-white'
                }`}
                disabled={disabled || isUpdating}
                key={item._id}
                onClick={() => void onToggleFound(item._id)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-base leading-tight font-semibold">
                    {item.name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
                      item.score >= 0
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.score > 0 ? `+${item.score}` : item.score}
                  </span>
                </div>

                {item.description ? (
                  <span className="pt-1 text-sm leading-6 text-slate-500">
                    {item.description}
                  </span>
                ) : null}

                <span
                  className={`pt-2 text-xs font-semibold tracking-[0.14em] uppercase ${
                    item.isFound ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {item.isFound ? 'Found' : 'Still hidden'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
