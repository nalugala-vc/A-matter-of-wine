import axios from 'axios'
import { getSession } from './auth'

// API client for backend requests
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token to all requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await getSession()
    if (session?.data?.session?.token) {
      config.headers.Authorization = `Bearer ${session.data.session.token}`
    }
  } catch {
    // Session not available, continue without token
  }
  return config
})

// Handle auth errors (avoid redirect loop on login/signup pages)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname
      if (path !== '/login' && path !== '/signup') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
