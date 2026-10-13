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

/** Start timing a doctor's view of a shared record. Resolves to { sessionId }. */
export async function startViewSession(id) {
  return api.post(`/api/records/${id}/view-sessions`)
}

/**
 * Report on an open view: `visible` credits the time since the last report,
 * `end` closes the session. Resolves to { activeSeconds, ended, accessEnded }.
 */
export async function sendViewHeartbeat(id, sessionId, { visible, end = false }) {
  return api.post(`/api/records/${id}/view-sessions/${sessionId}/heartbeat`, { visible, end }, { keepalive: end })
}

/** A shared record, for the in-app secure viewer only (doctors can't download). */
export async function viewRecord(id) {
  return api.download(`/api/records/${id}/download?purpose=view`)
}

export async function deleteRecord(id) {
  return api.delete(`/api/records/${id}`)
}
