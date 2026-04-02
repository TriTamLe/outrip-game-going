import type { Id } from '../../../convex/_generated/dataModel'

export type PostureWordRecord = {
  _id: Id<'postureWords'>
  english: string
  vietnamese: string
  order: number
}

export type PostureWordFormValues = {
  english: string
  vietnamese: string
}
