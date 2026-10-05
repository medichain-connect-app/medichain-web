import { api } from '../lib/api'

export async function getMyRequests() {
  return api.get('/api/doctor-requests/mine')
}

export async function getMyAcceptedDoctors(limit = 5) {
  return api.get('/api/doctor-requests/mine/accepted-doctors', { limit })
}

export async function getConnectionStatus(doctorId) {
  const data = await api.get('/api/doctor-requests/status', { doctorId })
  return data.status
}

export async function requestConnection(doctorId) {
  return api.post('/api/doctor-requests', { doctorId })
}

export async function getIncomingRequests(status = 'pending') {
  return api.get('/api/doctor-requests/incoming', { status })
}

export async function getAcceptedPatients() {
  return api.get('/api/doctor-requests/incoming/accepted')
}

export async function setRequestStatus(id, status) {
  return api.patch(`/api/doctor-requests/${id}`, { status })
}
