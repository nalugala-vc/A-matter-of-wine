import { useState, useEffect, useCallback, useRef } from 'react'
import { AppNotification } from '../types'
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
} from '../services'

interface UseNotificationsState {
  notifications: AppNotification[]
  total: number
  loading: boolean
  error: string | null
}

export function useNotifications(enabled = true) {
  const [state, setState] = useState<UseNotificationsState>({
    notifications: [],
    total: 0,
    loading: false,
    error: null,
  })

  const fetchNotifications = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await getNotifications()
      setState({
        notifications: result.notifications,
        total: result.total,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load notifications',
      }))
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    fetchNotifications()
  }, [fetchNotifications, enabled])

  const markAsRead = async (id: string) => {
    await markOneRead(id)
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }))
  }

  const markAllAsRead = async () => {
    await markAllRead()
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
    }))
  }

  return { ...state, refetch: fetchNotifications, markAsRead, markAllAsRead }
}

export function useUnreadCount(enabled = true) {
  const [count, setCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const fetchCount = useCallback(async () => {
    try {
      const c = await getUnreadCount()
      setCount(c)
    } catch {
      // Silently fail
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    fetchCount()
    intervalRef.current = setInterval(fetchCount, 30000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchCount, enabled])

  return { count, refetch: fetchCount }
}
