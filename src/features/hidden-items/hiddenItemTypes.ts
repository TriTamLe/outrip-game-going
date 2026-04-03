import type { Id } from '../../../convex/_generated/dataModel'

export type HiddenItemRecord = {
  _id: Id<'hiddenItems'>
  name: string
  description?: string
  score: number
  isFound: boolean
  order: number
}

export type HiddenItemFormValues = {
  name: string
  description?: string
  score: number
  isFound: boolean
}
