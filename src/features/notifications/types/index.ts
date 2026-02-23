export type NotificationType = 'like' | 'comment' | 'follow' | 'mention'

export interface AppNotification {
  id: string
  type: NotificationType
  actorId: string
  actorUsername: string
  actorAvatarUrl?: string
  targetId?: string
  targetType?: 'post' | 'comment' | 'user'
  preview?: string
  isRead: boolean
  createdAt: string
}

// API response types
export interface NotificationApiResponse {
  id: string
  type: NotificationType
  actor_id: string
  actor_username: string
  actor_avatar_url?: string
  target_id?: string
  target_type?: 'post' | 'comment' | 'user'
  preview?: string
  is_read: boolean
  created_at: string
}

export interface NotificationListApiResponse {
  notifications: NotificationApiResponse[]
  total: number
  page: number
  page_size: number
}

export function transformNotification(api: NotificationApiResponse): AppNotification {
  return {
    id: api.id,
    type: api.type,
    actorId: api.actor_id,
    actorUsername: api.actor_username,
    actorAvatarUrl: api.actor_avatar_url,
    targetId: api.target_id,
    targetType: api.target_type,
    preview: api.preview,
    isRead: api.is_read,
    createdAt: api.created_at,
  }
}
