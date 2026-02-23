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
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface WineStats {
  total: number
  tried: number
  wishlist: number
  favorite: number
}

export interface WineListResponse {
  wines: Wine[]
  total: number
  page: number
  pageSize: number
}

export interface WineFormData {
  name: string
  year: number
  region: string
  rating: number
  tastingNotes: string
  pairingDetails: string
  category: WineCategory
  isPublic: boolean
  image?: File
}

// API request type (snake_case for backend)
export interface WineCreateRequest {
  name: string
  year: number
  region: string
  rating: number
  tasting_notes: string
  pairing_details: string
  category: WineCategory
  is_public: boolean
}

// API response types (snake_case from backend)
export interface WineApiResponse {
  id: string
  name: string
  year: number
  region: string
  rating: number
  tasting_notes: string
  pairing_details: string
  category: WineCategory
  image_url?: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface WineListApiResponse {
  wines: WineApiResponse[]
  total: number
  page: number
  page_size: number
}

// Transform API response to frontend type
export function transformWine(api: WineApiResponse): Wine {
  return {
    id: api.id,
    name: api.name,
    year: api.year,
    region: api.region,
    rating: api.rating,
    tastingNotes: api.tasting_notes,
    pairingDetails: api.pairing_details,
    category: api.category,
    imageUrl: api.image_url,
    isPublic: api.is_public,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  }
}

// Transform frontend form data to API request
export function toWineCreateRequest(data: Omit<WineFormData, 'image'>): WineCreateRequest {
  return {
    name: data.name,
    year: data.year,
    region: data.region,
    rating: data.rating,
    tasting_notes: data.tastingNotes,
    pairing_details: data.pairingDetails,
    category: data.category,
    is_public: data.isPublic,
  }
}
