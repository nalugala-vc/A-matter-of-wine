import { useState, useEffect, useCallback } from 'react'
import { Event, RSVPStatus } from '../types'
import { getEvents, getEvent, rsvpToEvent, cancelRsvp, GetEventsParams } from '../services'

interface UseEventsState {
  events: Event[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
}

export function useEvents(initialParams: GetEventsParams = {}) {
  const [state, setState] = useState<UseEventsState>({
    events: [],
    total: 0,
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 20,
    loading: true,
    error: null,
  })
  const [filters, setFilters] = useState<GetEventsParams>(initialParams)

  const fetchEvents = useCallback(async (params: GetEventsParams = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const mergedParams = { ...filters, ...params }
      const result = await getEvents(mergedParams)
      
      setState({
        events: result.events,
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch events',
      }))
    }
  }, [filters])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const updateFilters = (newFilters: GetEventsParams) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const setPage = (page: number) => {
    updateFilters({ page })
  }

  return {
    ...state,
    filters,
    refetch: fetchEvents,
    updateFilters,
    setPage,
  }
}

interface UseEventState {
  event: Event | null
  loading: boolean
  error: string | null
}

export function useEvent(eventId: string | null) {
  const [state, setState] = useState<UseEventState>({
    event: null,
    loading: !!eventId,
    error: null,
  })

  const fetchEvent = useCallback(async () => {
    if (!eventId) {
      setState({ event: null, loading: false, error: null })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const event = await getEvent(eventId)
      setState({ event, loading: false, error: null })
    } catch (err) {
      setState({
        event: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch event',
      })
    }
  }, [eventId])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  const handleRsvp = async (status: RSVPStatus) => {
    if (!eventId) return
    
    try {
      const updatedEvent = await rsvpToEvent(eventId, status)
      setState(prev => ({ ...prev, event: updatedEvent }))
      return updatedEvent
    } catch (err) {
      throw err
    }
  }

  const handleCancelRsvp = async () => {
    if (!eventId) return
    
    try {
      await cancelRsvp(eventId)
      await fetchEvent() // Refresh to get updated attendees
    } catch (err) {
      throw err
    }
  }

  return {
    ...state,
    refetch: fetchEvent,
    rsvp: handleRsvp,
    cancelRsvp: handleCancelRsvp,
  }
}
