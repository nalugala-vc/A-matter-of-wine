export interface UserProfile {
  id: string
  username: string
  avatarUrl?: string
  coverImageUrl?: string
  bio?: string
  location?: string
  winePreferences: string[]
  isPublic: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing: boolean
  createdAt: string
}

export interface UserCard {
  id: string
  username: string
  avatarUrl?: string
  bio?: string
  winePreferences: string[]
  followersCount: number
  isFollowing: boolean
}

export interface PublicWine {
  id: string
  name: string
  year: number
  region: string
  rating: number
  tastingNotes: string
  category: string
  imageUrl?: string
  createdAt: string
}

// API response types
export interface UserProfileApiResponse {
  id: string
  username: string
  avatar_url?: string
  cover_image_url?: string
  bio?: string
  location?: string
  wine_preferences: string[]
  is_public: boolean
  followers_count: number
  following_count: number
  posts_count: number
  is_following: boolean
  created_at: string
}

export interface UserCardApiResponse {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  wine_preferences: string[]
  followers_count: number
  is_following: boolean
}

export interface UserSearchApiResponse {
  users: UserCardApiResponse[]
  total: number
  page: number
  page_size: number
}

export interface FollowApiResponse {
  status: string
  followers_count: number
  following_count: number
}

export interface PublicWineApiResponse {
  id: string
  name: string
  year: number
  region: string
  rating: number
  tasting_notes: string
  category: string
  image_url?: string
  created_at: string
}

export interface PublicCellarApiResponse {
  wines: PublicWineApiResponse[]
  total: number
  page: number
  page_size: number
}

// Transforms
export function transformUserProfile(api: UserProfileApiResponse): UserProfile {
  return {
    id: api.id,
    username: api.username,
    avatarUrl: api.avatar_url,
    coverImageUrl: api.cover_image_url,
    bio: api.bio,
    location: api.location,
    winePreferences: api.wine_preferences,
    isPublic: api.is_public,
    followersCount: api.followers_count,
    followingCount: api.following_count,
    postsCount: api.posts_count,
    isFollowing: api.is_following,
    createdAt: api.created_at,
  }
}

export function transformUserCard(api: UserCardApiResponse): UserCard {
  return {
    id: api.id,
    username: api.username,
    avatarUrl: api.avatar_url,
    bio: api.bio,
    winePreferences: api.wine_preferences,
    followersCount: api.followers_count,
    isFollowing: api.is_following,
  }
}

export function transformPublicWine(api: PublicWineApiResponse): PublicWine {
  return {
    id: api.id,
    name: api.name,
    year: api.year,
    region: api.region,
    rating: api.rating,
    tastingNotes: api.tasting_notes,
    category: api.category,
    imageUrl: api.image_url,
    createdAt: api.created_at,
  }
}
