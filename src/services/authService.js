import { api } from '../lib/api'

export async function signup({ email, password, fullName, role }) {
  return api.post('/api/auth/signup', { email, password, fullName, role })
}

export async function login({ email, password }) {
  return api.post('/api/auth/login', { email, password })
}

export async function googleSignIn(idToken) {
  return api.post('/api/auth/google', { idToken })
}

export async function completeProfile(role) {
  return api.post('/api/auth/complete-profile', { role })
}

export async function refreshToken(refresh_token) {
  return api.post('/api/auth/refresh', { refresh_token })
}

export async function getMe() {
  return api.get('/api/auth/me')
}

export async function getRole() {
  const data = await api.get('/api/auth/role')
  return data.role
}
