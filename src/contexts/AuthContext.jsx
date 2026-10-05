import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const saveSession = useCallback((data) => {
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    setUser(data.user)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setLoading(false); return }
    authService.getMe()
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
      .finally(() => setLoading(false))
  }, [])

  async function signUp({ email, password, fullName, role }) {
    const data = await authService.signup({ email, password, fullName, role })
    if (data.needsEmailConfirmation) return data
    saveSession(data)
    return data
  }

  async function signIn({ email, password }) {
    const data = await authService.login({ email, password })
    saveSession(data)
    return data
  }

  async function googleSignIn(idToken) {
    const data = await authService.googleSignIn(idToken)
    saveSession(data)
    return data
  }

  async function completeGoogleProfile(role) {
    const data = await authService.completeProfile(role)
    setUser(data.user)
    return data
  }

  async function refreshProfile() {
    const data = await authService.getMe()
    setUser(data.user)
  }

  function signOut() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{
      user, loading, signUp, signIn, googleSignIn, completeGoogleProfile,
      refreshProfile, signOut, isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
