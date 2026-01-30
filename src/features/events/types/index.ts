export interface Event {
  id: string
  title: string
  description: string
  location: string
  date: string // ISO date string
  startTime: string
  endTime: string
  price: number | 'Free'
  imageUrl?: string
  isFeatured: boolean
  category?: string
  createdAt: string
  updatedAt: string
}

export type ViewMode = 'list' | 'month' | 'day'
