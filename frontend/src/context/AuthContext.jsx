import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService'
import { getToken, setToken, setUnauthorizedHandler } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null))
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    authService
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { token, user } = await authService.login(email, password)
    setToken(token)
    setUser(user)
  }

  const register = async (data) => {
    const { token, user } = await authService.register(data)
    setToken(token)
    setUser(user)
  }

  const updateProfile = async (data) => {
    const { user } = await authService.updateMe(data)
    setUser(user)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
