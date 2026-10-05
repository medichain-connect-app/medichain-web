import { api } from '../lib/api'

export async function listDoctors(params) {
  return api.get('/api/doctors', params)
}

export async function getSpecializations() {
  return api.get('/api/doctors/specializations')
}

export async function getMyDoctorProfile() {
  return api.get('/api/doctors/me')
}

export async function upsertDoctorProfile({ fullName, doctor }) {
  return api.put('/api/doctors/me', { fullName, doctor })
}

export async function getDoctor(id) {
  return api.get(`/api/doctors/${id}`)
}
