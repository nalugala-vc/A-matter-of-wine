import { useState, useEffect, useCallback } from 'react'
import { Story } from '../types'
import { getStories, getStory, GetStoriesParams } from '../services'

interface UseStoriesState {
  stories: Story[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
}

export function useStories(initialParams: GetStoriesParams = {}) {
  const [state, setState] = useState<UseStoriesState>({
    stories: [],
    total: 0,
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 20,
    loading: true,
    error: null,
  })

  const fetchStories = useCallback(async (params: GetStoriesParams = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await getStories({
        page: params.page || state.page,
        pageSize: params.pageSize || state.pageSize,
      })
      
      setState({
        stories: result.stories,
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
        error: err instanceof Error ? err.message : 'Failed to fetch stories',
      }))
    }
  }, [state.page, state.pageSize])

  useEffect(() => {
    fetchStories(initialParams)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const setPage = (page: number) => {
    fetchStories({ page, pageSize: state.pageSize })
  }

  return {
    ...state,
    refetch: fetchStories,
    setPage,
  }
}

interface UseStoryState {
  story: Story | null
  loading: boolean
  error: string | null
}

export function useStory(storyId: string | null) {
  const [state, setState] = useState<UseStoryState>({
    story: null,
    loading: !!storyId,
    error: null,
  })

  useEffect(() => {
    if (!storyId) {
      setState({ story: null, loading: false, error: null })
      return
    }

    const fetchStory = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const story = await getStory(storyId)
        setState({ story, loading: false, error: null })
      } catch (err) {
        setState({
          story: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch story',
        })
      }
    }

    fetchStory()
  }, [storyId])

  return state
}
