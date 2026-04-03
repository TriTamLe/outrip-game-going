import { Typography } from 'antd'

type KindHuntPresentOverlayProps = {
  remainingCount: number
}

export function KindHuntPresentOverlay({
  remainingCount,
}: KindHuntPresentOverlayProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center p-6 sm:p-8">
      <div className="absolute inset-0 bg-slate-950/18 backdrop-blur-[2px]" />
      <section className="relative grid w-full max-w-3xl gap-5 rounded-[40px] border border-white/75 bg-white/95 px-8 py-8 text-center shadow-[0_48px_140px_rgba(15,23,42,0.32)] sm:px-12 sm:py-12">
        <Typography.Text className="text-[0.8rem] font-bold tracking-[0.22em] text-slate-500 uppercase">
          Cuộc Đi Săn Đầy Yêu Thương
        </Typography.Text>
        <Typography.Title
          className="!mb-0 !text-[clamp(2.4rem,5vw,4.2rem)] !leading-[0.96] !tracking-[-0.05em] !text-slate-950"
          level={1}
        >
          {remainingCount}
        </Typography.Title>
        <Typography.Text className="text-[clamp(1.1rem,2vw,1.5rem)] text-slate-700">
          hidden items still to find
        </Typography.Text>
      </section>
    </div>
  )
}
