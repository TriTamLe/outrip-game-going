export const teamMeta = [
  {
    key: 'kindness',
    name: 'Kindness',
    accent: '#d97757',
    surface:
      'linear-gradient(135deg, rgba(255, 241, 230, 0.98), rgba(255, 226, 214, 0.88))',
    buttonColor: '#c75c36',
  },
  {
    key: 'oneTeam',
    name: 'One-Team',
    accent: '#2563eb',
    surface:
      'linear-gradient(135deg, rgba(232, 242, 255, 0.98), rgba(213, 229, 255, 0.9))',
    buttonColor: '#1d4ed8',
  },
  {
    key: 'excellence',
    name: 'Excellence',
    accent: '#b7791f',
    surface:
      'linear-gradient(135deg, rgba(255, 247, 220, 0.98), rgba(255, 234, 178, 0.9))',
    buttonColor: '#a16207',
  },
  {
    key: 'sustainability',
    name: 'Sustainability',
    accent: '#2f855a',
    surface:
      'linear-gradient(135deg, rgba(232, 248, 238, 0.98), rgba(208, 240, 218, 0.9))',
    buttonColor: '#1f6d47',
  },
] as const

export type TeamKey = (typeof teamMeta)[number]['key']

export type TeamCard = {
  key: TeamKey
  name: string
  accent: string
  surface: string
  buttonColor: string
  score: number | null
}
