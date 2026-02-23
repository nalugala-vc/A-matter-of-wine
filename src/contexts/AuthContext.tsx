import { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signUp, signOut } from '../lib/auth'

interface User {
  id: string
  email: string
  name: string
  image?: string | null
  role?: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: typeof signIn
  signUp: typeof signUp
  signOut: typeof signOut
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
        image: session.user.image,
        role: (session.user as { role?: 'user' | 'admin' }).role || 'user',
      }
    : null

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
