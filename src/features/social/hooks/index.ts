import { useState, useEffect, useCallback } from 'react'
import { UserProfile, UserCard, PublicWine } from '../types'
import {
  getUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  discoverUsers,
  getFollowers,
  getFollowing,
  getPublicCellar,
} from '../services'

// --- Profile ---

interface UseProfileState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export function useProfile(userId: string | null) {
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    loading: !!userId,
    error: null,
  })

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const profile = await getUserProfile(userId)
      setState({ profile, loading: false, error: null })
    } catch (err) {
      setState({
        profile: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load profile',
      })
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const toggleFollow = async () => {
    if (!state.profile) return
    try {
      if (state.profile.isFollowing) {
        const result = await unfollowUser(state.profile.id)
        setState(prev => ({
          ...prev,
          profile: prev.profile
            ? { ...prev.profile, isFollowing: false, followersCount: result.followers_count }
            : null,
        }))
      } else {
        const result = await followUser(state.profile.id)
        setState(prev => ({
          ...prev,
          profile: prev.profile
            ? { ...prev.profile, isFollowing: true, followersCount: result.followers_count }
            : null,
        }))
      }
    } catch {
      // Silently fail
    }
  }

  return { ...state, refetch: fetchProfile, toggleFollow }
}

// --- User Search ---

interface UseUserSearchState {
  users: UserCard[]
  total: number
  loading: boolean
  error: string | null
}

export function useUserSearch() {
  const [state, setState] = useState<UseUserSearchState>({
    users: [],
    total: 0,
    loading: false,
    error: null,
  })
  const [query, setQuery] = useState('')

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setState({ users: [], total: 0, loading: false, error: null })
      return
    }
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await searchUsers(q)
      setState({ users: result.users, total: result.total, loading: false, error: null })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Search failed',
      }))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, search])

  return { ...state, query, setQuery }
}

// --- Discover ---

export function useDiscover() {
  const [state, setState] = useState<UseUserSearchState>({
    users: [],
    total: 0,
    loading: true,
    error: null,
  })

  const fetchDiscover = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await discoverUsers()
      setState({ users: result.users, total: result.total, loading: false, error: null })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load suggestions',
      }))
    }
  }, [])

  useEffect(() => {
    fetchDiscover()
  }, [fetchDiscover])

  return { ...state, refetch: fetchDiscover }
}

// --- Follow Lists ---

export function useFollowList(userId: string | null, type: 'followers' | 'following') {
  const [state, setState] = useState<UseUserSearchState>({
    users: [],
    total: 0,
    loading: false,
    error: null,
  })

  const fetch = useCallback(async () => {
    if (!userId) return
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const fetcher = type === 'followers' ? getFollowers : getFollowing
      const result = await fetcher(userId)
      setState({ users: result.users, total: result.total, loading: false, error: null })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load list',
      }))
    }
  }, [userId, type])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { ...state, refetch: fetch }
}

// --- Public Cellar ---

interface UsePublicCellarState {
  wines: PublicWine[]
  total: number
  loading: boolean
  error: string | null
}

export function usePublicCellar(userId: string | null) {
  const [state, setState] = useState<UsePublicCellarState>({
    wines: [],
    total: 0,
    loading: false,
    error: null,
  })

  const fetchCellar = useCallback(async (category?: string) => {
    if (!userId) return
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await getPublicCellar(userId, 1, 50, category)
      setState({ wines: result.wines, total: result.total, loading: false, error: null })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load cellar',
      }))
    }
  }, [userId])

  useEffect(() => {
    fetchCellar()
  }, [fetchCellar])

  return { ...state, refetch: fetchCellar }
}
