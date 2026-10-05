import { api } from '../lib/api'

export async function getMyProfile() {
  return api.get('/api/profiles/me')
}

export async function updateFullName(full_name) {
  return api.patch('/api/profiles/me', { full_name })
}

export async function getMyStats() {
  return api.get('/api/profiles/me/stats')
}
