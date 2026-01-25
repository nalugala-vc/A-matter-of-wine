export type WineCategory = 'tried' | 'wishlist' | 'favorite'

export interface Wine {
  id: string
  name: string
  year: number
  region: string
  rating: number
  tastingNotes: string
  pairingDetails: string
  category: WineCategory
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface WineFormData {
  name: string
  year: number
  region: string
  rating: number
  tastingNotes: string
  pairingDetails: string
  category: WineCategory
  image?: File
}
