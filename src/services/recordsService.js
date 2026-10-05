import { api } from '../lib/api'

export async function listMyRecords() {
  return api.get('/api/records')
}

export async function getRecord(id) {
  return api.get(`/api/records/${id}`)
}

export async function uploadRecord(file, title, category) {
  return api.upload('/api/records/upload', file, { title, category })
}

export async function downloadRecord(id) {
  return api.download(`/api/records/${id}/download`)
}

export async function deleteRecord(id) {
  return api.delete(`/api/records/${id}`)
}
