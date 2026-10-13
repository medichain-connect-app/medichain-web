import { api } from '../lib/api'

/** expiresAt: ISO string, or null for access that never expires. */
export async function shareRecords({ recordIds, doctorId, expiresAt = null }) {
  return api.post('/api/sharing/share', { recordIds, doctorId, expiresAt })
}

/** Everything the patient currently shares, with doctor details and expiry. */
export async function getMyShares() {
  return api.get('/api/sharing/mine')
}

export async function revokeShare(recordId, doctorId) {
  return api.post('/api/sharing/revoke', { recordId, doctorId })
}

export async function getSharedRecordIds(doctorId) {
  const ids = await api.get('/api/sharing/with-doctor', { doctorId })
  return new Set(ids)
}

export async function getRecordsSharedWithMe(patientId) {
  const data = await api.get('/api/sharing/with-me', patientId ? { patientId } : {})
  return data.map(s => ({ ...s.record, shared_at: s.shared_at }))
}
