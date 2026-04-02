import { Tag } from 'antd'
import { idiomStatusMeta, type IdiomStatusValue } from '../idiomStatus.ts'

type IdiomStatusTagProps = {
  value: IdiomStatusValue
}

export function IdiomStatusTag({ value }: IdiomStatusTagProps) {
  const meta = idiomStatusMeta[value]

  return (
    <Tag
      className="!mr-0 !rounded-full !px-3 !py-1 !text-[0.7rem] !font-semibold !tracking-[0.16em] !uppercase"
      color={meta.color}
    >
      {meta.label}
    </Tag>
  )
}
