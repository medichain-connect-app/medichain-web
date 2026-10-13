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

/** The patient's own record, as a file to save. */
export async function downloadRecord(id) {
  return api.download(`/api/records/${id}/download`)
}

/** A shared record, for the in-app secure viewer only (doctors can't download). */
export async function viewRecord(id) {
  return api.download(`/api/records/${id}/download?purpose=view`)
}

export async function deleteRecord(id) {
  return api.delete(`/api/records/${id}`)
}
