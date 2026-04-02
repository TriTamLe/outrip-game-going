export type TeamMember = {
  name: string
  role?: string
}

export const teamMeta = [
  {
    key: 'kindness',
    name: 'Kindness',
    accent: '#d97757',
    surface:
      'linear-gradient(135deg, rgba(255, 241, 230, 0.98), rgba(255, 226, 214, 0.88))',
    buttonColor: '#c75c36',
    members: [
      { name: 'Hoang Nguyen', role: 'Team Leader' },
      { name: 'Minh Vien' },
      { name: 'Hieu Vo' },
      { name: 'Trang Huynh' },
      { name: 'Duy Phan' },
      { name: 'Tri Vu' },
      { name: 'Cat Nguyen' },
    ],
  },
  {
    key: 'oneTeam',
    name: 'One-Team',
    accent: '#2563eb',
    surface:
      'linear-gradient(135deg, rgba(232, 242, 255, 0.98), rgba(213, 229, 255, 0.9))',
    buttonColor: '#1d4ed8',
    members: [
      { name: 'Kiet Ta', role: 'Team Leader' },
      { name: 'Tan Nguyen' },
      { name: 'Duc Huy' },
      { name: 'Han Ho' },
      { name: 'Phu Nguyen' },
      { name: 'Tuan Nguyen' },
      { name: 'Huyen Nguyen' },
    ],
  },
  {
    key: 'excellence',
    name: 'Excellence',
    accent: '#b7791f',
    surface:
      'linear-gradient(135deg, rgba(255, 247, 220, 0.98), rgba(255, 234, 178, 0.9))',
    buttonColor: '#a16207',
    members: [
      { name: 'Quoc Huynh', role: 'Team Leader' },
      { name: 'Trinh Dang' },
      { name: 'Dung Pham' },
      { name: 'Tuyen Tran' },
      { name: 'Nghia Huynh' },
      { name: 'Nhi Le' },
    ],
  },
  {
    key: 'sustainability',
    name: 'Sustainability',
    accent: '#2f855a',
    surface:
      'linear-gradient(135deg, rgba(232, 248, 238, 0.98), rgba(208, 240, 218, 0.9))',
    buttonColor: '#1f6d47',
    members: [
      { name: 'Thinh Tran', role: 'Team Leader' },
      { name: 'Vy Duong' },
      { name: 'Nghia Tran' },
      { name: 'Huy Nguyen' },
      { name: 'Kiet Tran' },
      { name: 'Ngan Vo' },
      { name: 'Rikard' },
    ],
  },
] as const

export type TeamKey = (typeof teamMeta)[number]['key']

export type TeamCard = {
  key: TeamKey
  name: string
  accent: string
  surface: string
  buttonColor: string
  members: readonly TeamMember[]
  score: number | null
}
