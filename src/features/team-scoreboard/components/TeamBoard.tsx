import { Button, Card, Form, InputNumber, Statistic, Typography } from 'antd'
import type { CSSProperties } from 'react'
import type { TeamCard } from '../teamMeta.ts'

type ScoreFormValues = {
  delta?: number
}

type TeamBoardProps = {
  team: TeamCard
  boardVariant?: 'default' | 'present' | 'control'
  mode?: 'display' | 'control'
  submitting?: boolean
  onAdjustScore?: (delta: number) => Promise<void>
}

export function TeamBoard({
  team,
  boardVariant = 'default',
  mode = 'display',
  submitting = false,
  onAdjustScore,
}: TeamBoardProps) {
  const [form] = Form.useForm<ScoreFormValues>()
  const isControl = mode === 'control'
  const variantClasses = {
    default: {
      card:
        '!rounded-[28px] shadow-[0_22px_50px_rgba(15,23,42,0.12)]',
      content: 'grid gap-6',
      title: '!mb-0 !text-[1.7rem] !font-bold !text-slate-900',
      label: 'text-[0.95rem] text-slate-600',
      score: 'text-[clamp(2.7rem,6vw,4.4rem)]',
      bodyPadding: 24,
      input:
        '!h-12 !w-full !rounded-2xl !bg-white/80 [&_.ant-input-number-input]:!h-[46px]',
      button: '!h-12 !rounded-2xl !font-bold',
    },
    present: {
      card:
        '!rounded-[32px] shadow-[0_28px_70px_rgba(15,23,42,0.14)]',
      content:
        'grid min-h-[min(33vh,360px)] content-between gap-7 max-[720px]:min-h-0',
      title: '!mb-0 !text-[clamp(2rem,3vw,2.8rem)] !font-bold !text-slate-900',
      label: 'text-base text-slate-600',
      score:
        'text-[clamp(5rem,10vw,8.5rem)] tracking-[-0.05em] max-[720px]:text-[clamp(3.8rem,17vw,6rem)]',
      bodyPadding: 28,
      input:
        '!h-12 !w-full !rounded-2xl !bg-white/80 [&_.ant-input-number-input]:!h-[46px]',
      button: '!h-12 !rounded-2xl !font-bold',
    },
    control: {
      card:
        '!rounded-[22px] shadow-[0_18px_40px_rgba(15,23,42,0.12)]',
      content: 'grid gap-4',
      title: '!mb-0 !text-[1.45rem] !font-bold !text-slate-900',
      label: 'text-[0.88rem] text-slate-600',
      score: 'text-[clamp(2.7rem,6vw,4.4rem)]',
      bodyPadding: 20,
      input:
        '!h-14 !w-full !rounded-2xl !bg-white/80 [&_.ant-input-number-input]:!h-[54px] [&_.ant-input-number-input]:!text-[1.15rem]',
      button: '!h-14 !rounded-2xl !text-base !font-bold',
    },
  }[boardVariant]

  async function handleFinish(values: ScoreFormValues) {
    if (typeof values.delta !== 'number' || !onAdjustScore) {
      return
    }

    await onAdjustScore(values.delta)
    form.resetFields()
  }

  return (
    <Card
      className={`relative overflow-hidden !border-0 ${variantClasses.card}`}
      bordered={false}
      styles={{ body: { padding: variantClasses.bodyPadding } }}
      style={
        {
          backgroundImage: team.surface,
        } as CSSProperties
      }
    >
      <div
        className="absolute inset-x-0 top-0 h-2"
        style={{ backgroundColor: team.accent }}
      />
      <div className={variantClasses.content}>
        <div className="grid gap-1.5">
          <Typography.Title className={variantClasses.title} level={3}>
            {team.name}
          </Typography.Title>
          <Typography.Text className={variantClasses.label}>
            Current score
          </Typography.Text>
        </div>

        <Statistic
          className="!text-slate-900"
          formatter={() => (
            <span
              className={`font-extrabold leading-none text-slate-900 ${variantClasses.score}`}
            >
              {team.score ?? 0}
            </span>
          )}
          loading={team.score === null}
          value={team.score ?? 0}
        />

        {isControl ? (
          <Form
            className={`grid ${boardVariant === 'control' ? 'gap-3' : 'gap-2.5'}`}
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
            <Form.Item<ScoreFormValues>
              className="!mb-0"
              label={
                <span
                  className={`font-semibold text-slate-700 ${
                    boardVariant === 'control' ? 'text-sm' : 'text-[0.95rem]'
                  }`}
                >
                  Adjust score
                </span>
              }
              name="delta"
              rules={[{ required: true, message: 'Enter a number.' }]}
            >
              <InputNumber
                className={variantClasses.input}
                controls={false}
                placeholder="10 or -5"
              />
            </Form.Item>

            <Button
              block
              className={`!border-none !shadow-none ${variantClasses.button}`}
              htmlType="submit"
              loading={submitting}
              type="primary"
              style={{ backgroundColor: team.buttonColor }}
            >
              Update score
            </Button>
          </Form>
        ) : null}
      </div>
    </Card>
  )
}
