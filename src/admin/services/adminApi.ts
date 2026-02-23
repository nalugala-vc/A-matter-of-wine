import apiClient from '../../lib/api'

// Dashboard
export const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard')
  return response.data
}

// Users
export const getUsers = async (params?: {
  search?: string
  role?: string
  page?: number
  page_size?: number
}) => {
  const response = await apiClient.get('/admin/users', { params })
  return response.data
}

export const getUserDetails = async (userId: string) => {
  const response = await apiClient.get(`/admin/users/${userId}`)
  return response.data
}

export const updateUser = async (
  userId: string,
  data: { username?: string; role?: 'user' | 'admin'; is_banned?: boolean }
) => {
  const response = await apiClient.patch(`/admin/users/${userId}`, data)
  return response.data
}

export const inviteAdmin = async (email: string) => {
  const response = await apiClient.post('/admin/users/invite', { email })
  return response.data
}

// Events
export const getAdminEvents = async (params?: {
  search?: string
  featured?: boolean
  page?: number
  page_size?: number
}) => {
  const response = await apiClient.get('/admin/events', { params })
  return response.data
}

export const createEvent = async (data: {
  title: string
  description: string
  location: string
  date: string
  start_time: string
  end_time: string
  price: number | 'Free'
  category?: string
  max_attendees?: number
}) => {
  const response = await apiClient.post('/admin/events', data)
  return response.data
}

export const updateEvent = async (eventId: string, data: Record<string, unknown>) => {
  const response = await apiClient.put(`/admin/events/${eventId}`, data)
  return response.data
}

export const toggleEventFeatured = async (eventId: string) => {
  const response = await apiClient.patch(`/admin/events/${eventId}/feature`)
  return response.data
}

export const deleteEvent = async (eventId: string) => {
  await apiClient.delete(`/admin/events/${eventId}`)
}

export const uploadEventImage = async (eventId: string, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post(`/admin/events/${eventId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

// Stories
export const getAdminStories = async (params?: {
  search?: string
  published?: boolean
  page?: number
  page_size?: number
}) => {
  const response = await apiClient.get('/admin/stories', { params })
  return response.data
}

export const createStory = async (data: {
  title: string
  description: string
  content: string
  image_url: string
  read_time: string
  date: string
}) => {
  const response = await apiClient.post('/admin/stories', data)
  return response.data
}

export const updateStory = async (storyId: string, data: Record<string, unknown>) => {
  const response = await apiClient.put(`/admin/stories/${storyId}`, data)
  return response.data
}

export const toggleStoryPublished = async (storyId: string) => {
  const response = await apiClient.patch(`/admin/stories/${storyId}/publish`)
  return response.data
}

export const deleteStory = async (storyId: string) => {
  await apiClient.delete(`/admin/stories/${storyId}`)
}
