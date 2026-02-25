import { createAuthClient } from 'better-auth/react'

// BetterAuth client configuration
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:3000',
})

// Export auth methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  updateUser,
} = authClient
