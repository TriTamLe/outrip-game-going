import { ReloadOutlined } from '@ant-design/icons'
import { Button, Card, Form, InputNumber, Statistic, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import type { TeamCard } from '../teamMeta.ts'

type ScoreFormValues = {
  delta?: number
}

type TeamBoardProps = {
  team: TeamCard
  boardVariant?: 'default' | 'present' | 'control'
  mode?: 'display' | 'control'
  submitting?: boolean
  comboScore?: number
  marker?: string | null
  showMembers?: boolean
  hideControlButtons?: boolean
  controlFooter?: ReactNode
  resetting?: boolean
  onResetScore?: () => void | Promise<void>
  onAdjustScore?: (delta: number) => void | Promise<void>
}

const quickAdjustments = [-20, -15, -10, -5, 5, 10, 15, 20] as const

export function TeamBoard({
  team,
  boardVariant = 'default',
  mode = 'display',
  submitting = false,
  comboScore = 0,
  marker = null,
  showMembers = true,
  hideControlButtons = false,
  controlFooter = null,
  resetting = false,
  onResetScore,
  onAdjustScore,
}: TeamBoardProps) {
  const [form] = Form.useForm<ScoreFormValues>()
  const isControl = mode === 'control'
  const isComboControl = isControl && boardVariant === 'control'
  const controlButtonPressClass = isControl
    ? 'active:scale-95 transition-transform'
    : ''
  const variantClasses = {
    default: {
      card: '!rounded-[28px] shadow-[0_22px_50px_rgba(15,23,42,0.12)]',
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
      card: '!rounded-[32px] shadow-[0_28px_70px_rgba(15,23,42,0.14)]',
      content: 'grid min-h-[min(38vh,430px)] gap-5 max-[720px]:min-h-0',
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
      card: '!rounded-[22px] shadow-[0_18px_40px_rgba(15,23,42,0.12)]',
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
  const comboScoreText =
    comboScore > 0 ? `+${comboScore}` : comboScore < 0 ? `${comboScore}` : '0'
  const comboScoreClassName =
    comboScore > 0
      ? 'text-emerald-700'
      : comboScore < 0
        ? 'text-rose-700'
        : 'text-slate-500'

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
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {marker ? (
                <div
                  className={`shrink-0 leading-none ${
                    boardVariant === 'present'
                      ? 'text-[clamp(2.8rem,5.4vw,4.1rem)]'
                      : 'text-[2rem]'
                  }`}
                >
                  {marker}
                </div>
              ) : null}

              <Typography.Title className={variantClasses.title} level={3}>
                {team.name}
              </Typography.Title>
            </div>

            {isComboControl && onResetScore ? (
              <Button
                aria-label={`Reset ${team.name} score`}
                className={`!h-9 !w-9 !rounded-full !border-white/70 !bg-white/76 !text-slate-700 !shadow-none ${controlButtonPressClass}`}
                icon={<ReloadOutlined />}
                loading={resetting}
                onClick={() => void onResetScore()}
              />
            ) : null}
          </div>
        </div>

        {boardVariant === 'present' ? (
          <div className="flex flex-1 gap-5 max-[720px]:flex-col">
            <div className="flex min-w-[180px] flex-[0.95] items-center">
              <Statistic
                className="!text-slate-900"
                formatter={() => (
                  <span
                    className={`inline-flex items-end gap-2 leading-none font-medium text-slate-900 ${variantClasses.score}`}
                  >
                    <span>{team.score ?? 0}</span>
                    <span className="text-[0.36em] leading-none">🌸</span>
                  </span>
                )}
                loading={team.score === null}
                value={team.score ?? 0}
              />
            </div>

            {showMembers ? (
              <div className="flex min-h-0 flex-2 items-center">
                <div className="grid max-h-[248px] w-full grid-cols-2 gap-3 overflow-hidden max-[720px]:max-h-none">
                  {team.members.map((member) => (
                    <div
                      className={`rounded-[18px] px-3.5 py-2.5 ${
                        member.role
                          ? 'border border-white/80 bg-white/72'
                          : 'bg-white/48'
                      }`}
                      key={`${team.key}-${member.name}`}
                    >
                      <div className="text-lg leading-tight font-semibold text-slate-900">
                        {member.name}
                      </div>
                      {member.role ? (
                        <div className="pt-0.5 text-[0.68rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                          {member.role}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <div className="min-w-0 flex-1">
              <Statistic
                className="!text-slate-900"
                formatter={() => (
                  <span
                    className={`inline-flex items-end gap-2 leading-none text-slate-900 ${variantClasses.score}`}
                  >
                    <span className="font-medium">{team.score ?? 0}</span>
                    <span className="text-[0.36em] leading-none">🌸</span>
                    {isComboControl &&
                    !hideControlButtons &&
                    comboScore !== 0 ? (
                      <span
                        className={`pb-[0.28em] text-[0.5em] leading-none font-medium select-none ${comboScoreClassName}`}
                      >
                        {comboScoreText}
                      </span>
                    ) : null}
                  </span>
                )}
                loading={team.score === null}
                value={team.score ?? 0}
              />
            </div>
          </div>
        )}

        {isComboControl ? (
          <div className="grid gap-2.5">
            {!hideControlButtons ? (
              <div className="grid gap-3">
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {quickAdjustments.map((delta) => {
                    const isPositive = delta > 0
                    const label = isPositive ? `+${delta}` : `${delta}`

                    return (
                      <Button
                        className={`!h-9 !shrink-0 !rounded-full !px-3 !text-sm !font-semibold !shadow-none !select-none ${controlButtonPressClass} ${
                          isPositive
                            ? '!border-0 !text-white'
                            : '!border-slate-200 !bg-white/86 !text-slate-900'
                        }`}
                        key={delta}
                        onClick={() => void onAdjustScore?.(delta)}
                        style={
                          isPositive
                            ? { backgroundColor: team.buttonColor }
                            : undefined
                        }
                      >
                        {label}
                      </Button>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    aria-label="Decrease score"
                    className={`!h-16 !w-full !rounded-[22px] !border-slate-200 !bg-white/86 !text-slate-900 !shadow-none !select-none hover:!border-slate-300 hover:!bg-white hover:!text-slate-950 ${controlButtonPressClass}`}
                    icon={<FiMinus className="text-[1.35rem]" />}
                    onClick={() => void onAdjustScore?.(-1)}
                    type="default"
                  />

                  <Button
                    aria-label="Increase score"
                    className={`!h-16 !w-full !rounded-[22px] !border-0 !text-white !shadow-none !select-none ${controlButtonPressClass}`}
                    icon={<FiPlus className="text-[1.35rem]" />}
                    onClick={() => void onAdjustScore?.(1)}
                    style={{ backgroundColor: team.buttonColor }}
                    type="primary"
                  />
                </div>
              </div>
            ) : null}

            {controlFooter}
          </div>
        ) : isControl ? (
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
              className={`!border-none !shadow-none ${variantClasses.button} ${controlButtonPressClass}`}
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
