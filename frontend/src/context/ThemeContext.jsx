import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'

const THEME_KEY = 'suivi-depenses:theme'

const ThemeContext = createContext(null)

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function ThemeProvider({ children }) {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || getSystemTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setThemeState(user.theme)
      localStorage.setItem(THEME_KEY, user.theme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const setTheme = useCallback(
    (next) => {
      setThemeState(next)
      localStorage.setItem(THEME_KEY, next)
      if (isAuthenticated) {
        updateProfile({ theme: next }).catch(() => {})
      }
    },
    [isAuthenticated, updateProfile],
  )

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
