import apiClient from '../../../lib/api'
import {
  Post,
  Comment,
  PostType,
  WineTag,
  PostApiResponse,
  PostListApiResponse,
  CommentApiResponse,
  CommentListApiResponse,
  transformPost,
  transformComment,
} from '../types'

// --- Posts ---

export interface CreatePostData {
  content: string
  postType?: PostType
  wineTag?: WineTag
}

export async function createPost(data: CreatePostData): Promise<Post> {
  const body: Record<string, unknown> = {
    content: data.content,
    post_type: data.postType || 'text',
  }
  if (data.wineTag) {
    body.wine_tag = data.wineTag
  }
  const response = await apiClient.post<PostApiResponse>('/posts', body)
  return transformPost(response.data)
}

export async function uploadPostImages(postId: string, files: File[]): Promise<Post> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  const response = await apiClient.post<PostApiResponse>(`/posts/${postId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return transformPost(response.data)
}

export interface GetPostsParams {
  page?: number
  pageSize?: number
}

export interface GetPostsResult {
  posts: Post[]
  total: number
  page: number
  pageSize: number
}

export async function getFeed(params: GetPostsParams = {}): Promise<GetPostsResult> {
  const { page = 1, pageSize = 20 } = params
  const response = await apiClient.get<PostListApiResponse>('/posts/feed', {
    params: { page, page_size: pageSize },
  })
  return {
    posts: response.data.posts.map(transformPost),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getExplore(params: GetPostsParams = {}): Promise<GetPostsResult> {
  const { page = 1, pageSize = 20 } = params
  const response = await apiClient.get<PostListApiResponse>('/posts/explore', {
    params: { page, page_size: pageSize },
  })
  return {
    posts: response.data.posts.map(transformPost),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getPost(postId: string): Promise<Post> {
  const response = await apiClient.get<PostApiResponse>(`/posts/${postId}`)
  return transformPost(response.data)
}

export async function deletePost(postId: string): Promise<void> {
  await apiClient.delete(`/posts/${postId}`)
}

// --- Likes ---

export async function likePost(postId: string): Promise<{ likesCount: number }> {
  const response = await apiClient.post<{ likes_count: number }>(`/posts/${postId}/like`)
  return { likesCount: response.data.likes_count }
}

export async function unlikePost(postId: string): Promise<{ likesCount: number }> {
  const response = await apiClient.delete<{ likes_count: number }>(`/posts/${postId}/like`)
  return { likesCount: response.data.likes_count }
}

export async function likeComment(commentId: string): Promise<{ likesCount: number }> {
  const response = await apiClient.post<{ likes_count: number }>(`/posts/comments/${commentId}/like`)
  return { likesCount: response.data.likes_count }
}

export async function unlikeComment(commentId: string): Promise<{ likesCount: number }> {
  const response = await apiClient.delete<{ likes_count: number }>(`/posts/comments/${commentId}/like`)
  return { likesCount: response.data.likes_count }
}

// --- Comments ---

export interface GetCommentsParams {
  page?: number
  pageSize?: number
}

export interface GetCommentsResult {
  comments: Comment[]
  total: number
  page: number
  pageSize: number
}

export async function getComments(postId: string, params: GetCommentsParams = {}): Promise<GetCommentsResult> {
  const { page = 1, pageSize = 20 } = params
  const response = await apiClient.get<CommentListApiResponse>(`/posts/${postId}/comments`, {
    params: { page, page_size: pageSize },
  })
  return {
    comments: response.data.comments.map(transformComment),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function createComment(postId: string, content: string): Promise<Comment> {
  const response = await apiClient.post<CommentApiResponse>(`/posts/${postId}/comments`, { content })
  return transformComment(response.data)
}

export async function deleteComment(commentId: string): Promise<void> {
  await apiClient.delete(`/posts/comments/${commentId}`)
}
