import apiClient from '../../../lib/api'
import { 
  Event, 
  EventApiResponse, 
  EventListApiResponse, 
  RSVPStatus,
  transformEvent 
} from '../types'

export interface GetEventsParams {
  search?: string
  featured?: boolean
  dateFrom?: string
  dateTo?: string
  category?: string
  page?: number
  pageSize?: number
}

export interface GetEventsResult {
  events: Event[]
  total: number
  page: number
  pageSize: number
}

export async function getEvents(params: GetEventsParams = {}): Promise<GetEventsResult> {
  const { page = 1, pageSize = 20, search, featured, dateFrom, dateTo, category } = params
  
  const response = await apiClient.get<EventListApiResponse>('/events', {
    params: {
      page,
      page_size: pageSize,
      search: search || undefined,
      featured: featured !== undefined ? featured : undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      category: category || undefined,
    },
  })
  
  return {
    events: response.data.events.map(transformEvent),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getEvent(eventId: string): Promise<Event> {
  const response = await apiClient.get<EventApiResponse>(`/events/${eventId}`)
  return transformEvent(response.data)
}

export async function rsvpToEvent(eventId: string, status: RSVPStatus): Promise<Event> {
  const response = await apiClient.post<EventApiResponse>(`/events/${eventId}/rsvp`, {
    status,
  })
  return transformEvent(response.data)
}

export async function cancelRsvp(eventId: string): Promise<void> {
  await apiClient.delete(`/events/${eventId}/rsvp`)
}

export function getCalendarSubscriptionUrl(): string {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/events/calendar.ics`
}
