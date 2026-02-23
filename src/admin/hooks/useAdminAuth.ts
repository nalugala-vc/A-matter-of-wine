import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function useAdminAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login')
      } else if (user?.role !== 'admin') {
        navigate('/') // Redirect non-admins to home
      }
    }
  }, [user, isLoading, isAuthenticated, navigate])

  return {
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
  }
}
