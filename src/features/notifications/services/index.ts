import apiClient from '../../../lib/api'
import {
  AppNotification,
  NotificationListApiResponse,
  transformNotification,
} from '../types'

export interface GetNotificationsResult {
  notifications: AppNotification[]
  total: number
  page: number
  pageSize: number
}

export async function getNotifications(page = 1, pageSize = 20): Promise<GetNotificationsResult> {
  const response = await apiClient.get<NotificationListApiResponse>('/notifications', {
    params: { page, page_size: pageSize },
  })
  return {
    notifications: response.data.notifications.map(transformNotification),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<{ count: number }>('/notifications/unread-count')
  return response.data.count
}

export async function markAllRead(): Promise<void> {
  await apiClient.patch('/notifications/read')
}

export async function markOneRead(notificationId: string): Promise<void> {
  await apiClient.patch(`/notifications/${notificationId}/read`)
}
