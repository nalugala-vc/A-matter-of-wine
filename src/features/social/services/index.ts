import apiClient from '../../../lib/api'
import {
  UserProfile,
  UserCard,
  PublicWine,
  UserProfileApiResponse,
  UserSearchApiResponse,
  FollowApiResponse,
  PublicCellarApiResponse,
  transformUserProfile,
  transformUserCard,
  transformPublicWine,
} from '../types'

// --- Profiles ---

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const response = await apiClient.get<UserProfileApiResponse>(`/social/${userId}/profile`)
  return transformUserProfile(response.data)
}

// --- Follow ---

export async function followUser(userId: string): Promise<FollowApiResponse> {
  const response = await apiClient.post<FollowApiResponse>(`/social/${userId}/follow`)
  return response.data
}

export async function unfollowUser(userId: string): Promise<FollowApiResponse> {
  const response = await apiClient.delete<FollowApiResponse>(`/social/${userId}/follow`)
  return response.data
}

// --- Followers / Following ---

export interface GetUsersResult {
  users: UserCard[]
  total: number
  page: number
  pageSize: number
}

export async function getFollowers(userId: string, page = 1, pageSize = 20): Promise<GetUsersResult> {
  const response = await apiClient.get<UserSearchApiResponse>(`/social/${userId}/followers`, {
    params: { page, page_size: pageSize },
  })
  return {
    users: response.data.users.map(transformUserCard),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getFollowing(userId: string, page = 1, pageSize = 20): Promise<GetUsersResult> {
  const response = await apiClient.get<UserSearchApiResponse>(`/social/${userId}/following`, {
    params: { page, page_size: pageSize },
  })
  return {
    users: response.data.users.map(transformUserCard),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

// --- Search & Discover ---

export async function searchUsers(q: string, page = 1, pageSize = 20): Promise<GetUsersResult> {
  const response = await apiClient.get<UserSearchApiResponse>('/social/search', {
    params: { q, page, page_size: pageSize },
  })
  return {
    users: response.data.users.map(transformUserCard),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function discoverUsers(page = 1, pageSize = 20): Promise<GetUsersResult> {
  const response = await apiClient.get<UserSearchApiResponse>('/social/discover', {
    params: { page, page_size: pageSize },
  })
  return {
    users: response.data.users.map(transformUserCard),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

// --- Public Cellar ---

export interface GetPublicCellarResult {
  wines: PublicWine[]
  total: number
  page: number
  pageSize: number
}

export async function getPublicCellar(userId: string, page = 1, pageSize = 20, category?: string): Promise<GetPublicCellarResult> {
  const response = await apiClient.get<PublicCellarApiResponse>(`/social/${userId}/cellar`, {
    params: { page, page_size: pageSize, category: category || undefined },
  })
  return {
    wines: response.data.wines.map(transformPublicWine),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}
