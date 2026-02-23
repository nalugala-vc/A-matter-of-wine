// Admin Types

export interface DashboardStats {
  stats: {
    total_users: number
    total_wines: number
    total_events: number
    total_stories: number
    total_conversations: number
  }
  recent_signups: {
    id: string
    username: string
    email: string
    created_at: string
  }[]
  upcoming_events: {
    id: string
    title: string
    date: string
    attendee_count: number
  }[]
}

export interface AdminUser {
  id: string
  email: string
  username: string
  avatar_url: string | null
  role: 'user' | 'admin'
  is_banned: boolean
  created_at: string
  updated_at: string
  wine_count?: number
  conversation_count?: number
}

export interface AdminUserListResponse {
  users: AdminUser[]
  total: number
  page: number
  page_size: number
}

export interface AdminEvent {
  id: string
  title: string
  description: string
  location: string
  date: string
  start_time: string
  end_time: string
  price: number | 'Free'
  category: string | null
  image_url: string | null
  is_featured: boolean
  organizer_id: string
  max_attendees: number | null
  attendee_count: number
  created_at: string
  updated_at: string
}

export interface AdminEventListResponse {
  events: AdminEvent[]
  total: number
  page: number
  page_size: number
}

export interface AdminStory {
  id: string
  title: string
  description: string
  content: string
  image_url: string
  author_id: string
  author_name: string
  read_time: string
  date: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface AdminStoryListResponse {
  stories: AdminStory[]
  total: number
  page: number
  page_size: number
}
