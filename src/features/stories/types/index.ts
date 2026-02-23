export interface Story {
  id: string
  title: string
  description: string
  content: string
  imageUrl: string
  authorId: string
  authorName: string
  readTime: string
  date: string
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface StoryListResponse {
  stories: Story[]
  total: number
  page: number
  pageSize: number
}

// API response type (snake_case from backend)
export interface StoryApiResponse {
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
  published_at?: string
  created_at: string
  updated_at: string
}

export interface StoryListApiResponse {
  stories: StoryApiResponse[]
  total: number
  page: number
  page_size: number
}

// Transform API response to frontend type
export function transformStory(api: StoryApiResponse): Story {
  return {
    id: api.id,
    title: api.title,
    description: api.description,
    content: api.content,
    imageUrl: api.image_url,
    authorId: api.author_id,
    authorName: api.author_name,
    readTime: api.read_time,
    date: api.date,
    isPublished: api.is_published,
    publishedAt: api.published_at,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  }
}
