import apiClient from '../../../lib/api'
import { 
  Wine, 
  WineCategory,
  WineStats,
  WineApiResponse, 
  WineListApiResponse,
  WineFormData,
  transformWine,
  toWineCreateRequest,
} from '../types'

export interface GetWinesParams {
  category?: WineCategory
  page?: number
  pageSize?: number
}

export interface GetWinesResult {
  wines: Wine[]
  total: number
  page: number
  pageSize: number
}

export async function getWines(params: GetWinesParams = {}): Promise<GetWinesResult> {
  const { page = 1, pageSize = 20, category } = params
  
  const response = await apiClient.get<WineListApiResponse>('/wines', {
    params: {
      page,
      page_size: pageSize,
      category: category || undefined,
    },
  })
  
  return {
    wines: response.data.wines.map(transformWine),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getWine(wineId: string): Promise<Wine> {
  const response = await apiClient.get<WineApiResponse>(`/wines/${wineId}`)
  return transformWine(response.data)
}

export async function getWineStats(): Promise<WineStats> {
  const response = await apiClient.get<WineStats>('/wines/stats')
  return response.data
}

export async function createWine(data: Omit<WineFormData, 'image'>): Promise<Wine> {
  const response = await apiClient.post<WineApiResponse>('/wines', toWineCreateRequest(data))
  return transformWine(response.data)
}

export async function updateWine(wineId: string, data: Partial<Omit<WineFormData, 'image'>>): Promise<Wine> {
  // Transform to snake_case for backend
  const apiData: Record<string, unknown> = {}
  if (data.name !== undefined) apiData.name = data.name
  if (data.year !== undefined) apiData.year = data.year
  if (data.region !== undefined) apiData.region = data.region
  if (data.rating !== undefined) apiData.rating = data.rating
  if (data.tastingNotes !== undefined) apiData.tasting_notes = data.tastingNotes
  if (data.pairingDetails !== undefined) apiData.pairing_details = data.pairingDetails
  if (data.category !== undefined) apiData.category = data.category
  if (data.isPublic !== undefined) apiData.is_public = data.isPublic
  
  const response = await apiClient.put<WineApiResponse>(`/wines/${wineId}`, apiData)
  return transformWine(response.data)
}

export async function deleteWine(wineId: string): Promise<void> {
  await apiClient.delete(`/wines/${wineId}`)
}

export async function uploadWineImage(wineId: string, file: File): Promise<Wine> {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await apiClient.post<WineApiResponse>(`/wines/${wineId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return transformWine(response.data)
}
