export type VisitEvent = {
  at: string
  path: string
  referrer: string
  country: string
  city: string
  device: string
}

export type DayRow = { date: string; views: number; uniques: number }
export type CountRow = { name: string; views: number }

export type Stats = {
  storage: 'redis' | 'file' | 'none'
  generatedAt: string
  today: { views: number; uniques: number }
  last7: { views: number; uniques: number }
  allTime: { views: number; uniques: number }
  days: DayRow[]
  pages: CountRow[]
  referrers: CountRow[]
  countries: CountRow[]
  devices: CountRow[]
  recent: VisitEvent[]
}
