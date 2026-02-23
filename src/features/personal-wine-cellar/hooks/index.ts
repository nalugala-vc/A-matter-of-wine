import { useState, useEffect, useCallback } from 'react'
import { Wine, WineCategory, WineStats, WineFormData } from '../types'
import { 
  getWines, 
  getWine, 
  getWineStats,
  createWine, 
  updateWine, 
  deleteWine,
  uploadWineImage,
  GetWinesParams 
} from '../services'

interface UseWinesState {
  wines: Wine[]
  total: number
  page: number
  pageSize: number
  loading: boolean
  error: string | null
}

export function useWines(initialParams: GetWinesParams = {}) {
  const [state, setState] = useState<UseWinesState>({
    wines: [],
    total: 0,
    page: initialParams.page || 1,
    pageSize: initialParams.pageSize || 20,
    loading: true,
    error: null,
  })
  const [category, setCategory] = useState<WineCategory | undefined>(initialParams.category)

  const fetchWines = useCallback(async (params: GetWinesParams = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await getWines({
        page: params.page || state.page,
        pageSize: params.pageSize || state.pageSize,
        category: params.category !== undefined ? params.category : category,
      })
      
      setState({
        wines: result.wines,
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
        error: err instanceof Error ? err.message : 'Failed to fetch wines',
      }))
    }
  }, [category, state.page, state.pageSize])

  useEffect(() => {
    fetchWines()
  }, [fetchWines])

  const filterByCategory = (newCategory: WineCategory | undefined) => {
    setCategory(newCategory)
  }

  const setPage = (page: number) => {
    fetchWines({ page })
  }

  const addWine = async (data: WineFormData): Promise<Wine> => {
    const { image, ...wineData } = data
    const newWine = await createWine(wineData)
    
    // Upload image if provided
    if (image) {
      const updatedWine = await uploadWineImage(newWine.id, image)
      await fetchWines() // Refresh list
      return updatedWine
    }
    
    await fetchWines() // Refresh list
    return newWine
  }

  const editWine = async (wineId: string, data: Partial<WineFormData>): Promise<Wine> => {
    const { image, ...wineData } = data
    let updatedWine = await updateWine(wineId, wineData)
    
    // Upload image if provided
    if (image) {
      updatedWine = await uploadWineImage(wineId, image)
    }
    
    await fetchWines() // Refresh list
    return updatedWine
  }

  const removeWine = async (wineId: string): Promise<void> => {
    await deleteWine(wineId)
    await fetchWines() // Refresh list
  }

  return {
    ...state,
    category,
    refetch: fetchWines,
    filterByCategory,
    setPage,
    addWine,
    editWine,
    removeWine,
  }
}

interface UseWineState {
  wine: Wine | null
  loading: boolean
  error: string | null
}

export function useWine(wineId: string | null) {
  const [state, setState] = useState<UseWineState>({
    wine: null,
    loading: !!wineId,
    error: null,
  })

  useEffect(() => {
    if (!wineId) {
      setState({ wine: null, loading: false, error: null })
      return
    }

    const fetchWine = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const wine = await getWine(wineId)
        setState({ wine, loading: false, error: null })
      } catch (err) {
        setState({
          wine: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch wine',
        })
      }
    }

    fetchWine()
  }, [wineId])

  return state
}

interface UseWineStatsState {
  stats: WineStats | null
  loading: boolean
  error: string | null
}

export function useWineStats() {
  const [state, setState] = useState<UseWineStatsState>({
    stats: null,
    loading: true,
    error: null,
  })

  const fetchStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const stats = await getWineStats()
      setState({ stats, loading: false, error: null })
    } catch (err) {
      setState({
        stats: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch wine stats',
      })
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    ...state,
    refetch: fetchStats,
  }
}
