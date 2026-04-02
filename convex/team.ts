import { v } from 'convex/values'

export const teamValidator = v.union(
  v.literal('kindness'),
  v.literal('oneTeam'),
  v.literal('excellence'),
  v.literal('sustainability'),
)

export const teamNames = {
  kindness: 'Kindness',
  oneTeam: 'One-Team',
  excellence: 'Excellence',
  sustainability: 'Sustainability',
} as const

export const teamOrder = [
  'kindness',
  'oneTeam',
  'excellence',
  'sustainability',
] as const

export type TeamKey = (typeof teamOrder)[number]
