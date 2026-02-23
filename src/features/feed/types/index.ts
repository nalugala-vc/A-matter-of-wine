export type PostType = 'text' | 'check_in' | 'review' | 'cellar_share'

export interface WineTag {
  name: string
  year?: number
  region?: string
  rating?: number
}

export interface Post {
  id: string
  authorId: string
  authorUsername: string
  authorAvatarUrl?: string
  content: string
  images: string[]
  wineTag?: WineTag
  postType: PostType
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorUsername: string
  authorAvatarUrl?: string
  content: string
  likesCount: number
  likedByMe: boolean
  createdAt: string
}

// API response types (snake_case from backend)
export interface PostApiResponse {
  id: string
  author_id: string
  author_username: string
  author_avatar_url?: string
  content: string
  images: string[]
  wine_tag?: {
    name: string
    year?: number
    region?: string
    rating?: number
  }
  post_type: PostType
  likes_count: number
  comments_count: number
  liked_by_me: boolean
  created_at: string
  updated_at: string
}

export interface PostListApiResponse {
  posts: PostApiResponse[]
  total: number
  page: number
  page_size: number
}

export interface CommentApiResponse {
  id: string
  post_id: string
  author_id: string
  author_username: string
  author_avatar_url?: string
  content: string
  likes_count: number
  liked_by_me: boolean
  created_at: string
}

export interface CommentListApiResponse {
  comments: CommentApiResponse[]
  total: number
  page: number
  page_size: number
}

// Transform API -> frontend
export function transformPost(api: PostApiResponse): Post {
  return {
    id: api.id,
    authorId: api.author_id,
    authorUsername: api.author_username,
    authorAvatarUrl: api.author_avatar_url,
    content: api.content,
    images: api.images,
    wineTag: api.wine_tag,
    postType: api.post_type,
    likesCount: api.likes_count,
    commentsCount: api.comments_count,
    likedByMe: api.liked_by_me,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  }
}

export function transformComment(api: CommentApiResponse): Comment {
  return {
    id: api.id,
    postId: api.post_id,
    authorId: api.author_id,
    authorUsername: api.author_username,
    authorAvatarUrl: api.author_avatar_url,
    content: api.content,
    likesCount: api.likes_count,
    likedByMe: api.liked_by_me,
    createdAt: api.created_at,
  }
}
