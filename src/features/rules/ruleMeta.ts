export const ruleGames = [
  {
    key: 'posture',
    name: 'Tâm Đầu Ý Hợp',
    statusValue: 'rule:posture',
  },
  {
    key: 'vienamese',
    name: 'Tiếng Tây Tiếng Ta',
    statusValue: 'rule:vienamese',
  },
  {
    key: 'async-battle',
    name: 'Cuộc đấu Bất đồng bộ',
    statusValue: 'rule:async-battle',
  },
  {
    key: 'kind-hunt',
    name: 'Cuộc đi săn đầy yêu thương',
    statusValue: 'rule:kind-hunt',
  },
] as const

export type RuleGameKey = (typeof ruleGames)[number]['key']
export type RuleStatusValue = (typeof ruleGames)[number]['statusValue']

export const ruleMetaByKey = Object.fromEntries(
  ruleGames.map((game) => [game.key, game]),
) as Record<RuleGameKey, (typeof ruleGames)[number]>

export const ruleMetaByStatus = Object.fromEntries(
  ruleGames.map((game) => [game.statusValue, game]),
) as Record<RuleStatusValue, (typeof ruleGames)[number]>
