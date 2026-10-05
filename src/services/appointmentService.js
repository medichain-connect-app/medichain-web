import { api } from '../lib/api'

export async function requestAppointment({ doctorId, preferredDate, preferredTime, notes }) {
  return api.post('/api/appointments', { doctorId, preferredDate, preferredTime, notes })
}

export async function hasExistingRequest(doctorId) {
  const data = await api.get('/api/appointments/exists', { doctorId })
  return data.exists
}

export async function getPendingAppointments() {
  return api.get('/api/appointments/pending')
}

export async function confirmAppointment(id, details) {
  return api.post(`/api/appointments/${id}/confirm`, details)
}

export async function declineAppointment(id) {
  return api.delete(`/api/appointments/${id}`)
}
