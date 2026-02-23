export type RSVPStatus = 'interested' | 'going' | 'maybe'

export interface Attendee {
  userId: string
  username: string
  status: RSVPStatus
  joinedAt: string
}

export interface Event {
  id: string
  title: string
  description: string
  location: string
  date: string
  startTime: string
  endTime: string
  price: number | 'Free'
  category?: string
  maxAttendees?: number
  imageUrl?: string
  isFeatured: boolean
  organizerId: string
  attendeeCount: number
  attendees: Attendee[]
  createdAt: string
  updatedAt: string
}

export interface EventListResponse {
  events: Event[]
  total: number
  page: number
  pageSize: number
}

export type ViewMode = 'list' | 'month' | 'day'

// API response types (snake_case from backend)
export interface AttendeeApiResponse {
  user_id: string
  username: string
  status: RSVPStatus
  joined_at: string
}

export interface EventApiResponse {
  id: string
  title: string
  description: string
  location: string
  date: string
  start_time: string
  end_time: string
  price: number | 'Free'
  category?: string
  max_attendees?: number
  image_url?: string
  is_featured: boolean
  organizer_id: string
  attendee_count: number
  attendees: AttendeeApiResponse[]
  created_at: string
  updated_at: string
}

export interface EventListApiResponse {
  events: EventApiResponse[]
  total: number
  page: number
  page_size: number
}

// Transform API response to frontend type
export function transformAttendee(api: AttendeeApiResponse): Attendee {
  return {
    userId: api.user_id,
    username: api.username,
    status: api.status,
    joinedAt: api.joined_at,
  }
}

export function transformEvent(api: EventApiResponse): Event {
  return {
    id: api.id,
    title: api.title,
    description: api.description,
    location: api.location,
    date: api.date,
    startTime: api.start_time,
    endTime: api.end_time,
    price: api.price,
    category: api.category,
    maxAttendees: api.max_attendees,
    imageUrl: api.image_url,
    isFeatured: api.is_featured,
    organizerId: api.organizer_id,
    attendeeCount: api.attendee_count,
    attendees: api.attendees.map(transformAttendee),
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  }
}
