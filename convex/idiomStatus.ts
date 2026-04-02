import { v } from 'convex/values'

export const idiomStatusValueValidator = v.union(
  v.literal('not-displayed'),
  v.literal('passed'),
  v.literal('guessed'),
)

export const idiomStatusValidator = v.object({
  kindness: idiomStatusValueValidator,
  oneTeam: idiomStatusValueValidator,
  excellence: idiomStatusValueValidator,
  sustainability: idiomStatusValueValidator,
})

export type IdiomStatusValue = 'not-displayed' | 'passed' | 'guessed'

export type IdiomStatus = {
  kindness: IdiomStatusValue
  oneTeam: IdiomStatusValue
  excellence: IdiomStatusValue
  sustainability: IdiomStatusValue
}

export function createDefaultIdiomStatus(): IdiomStatus {
  return {
    kindness: 'not-displayed',
    oneTeam: 'not-displayed',
    excellence: 'not-displayed',
    sustainability: 'not-displayed',
  }
}

export function normalizeIdiomStatus(
  status?: Partial<IdiomStatus>,
): IdiomStatus {
  return {
    kindness: status?.kindness ?? 'not-displayed',
    oneTeam: status?.oneTeam ?? 'not-displayed',
    excellence: status?.excellence ?? 'not-displayed',
    sustainability: status?.sustainability ?? 'not-displayed',
  }
}

export function hasSameIdiomStatus(
  left: IdiomStatus,
  right: IdiomStatus,
): boolean {
  return (
    left.kindness === right.kindness &&
    left.oneTeam === right.oneTeam &&
    left.excellence === right.excellence &&
    left.sustainability === right.sustainability
  )
}
