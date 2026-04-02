import type { Id } from '../../../convex/_generated/dataModel'
import type { RuleGameKey } from './ruleMeta.ts'

export type RuleRecord = {
  _id: Id<'rules'>
  game: RuleGameKey
  markdown: string
}

export type RuleFormValues = {
  game: RuleGameKey
  markdown: string
}
