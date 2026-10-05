import { api } from '../lib/api'

export async function shareRecords({ recordIds, doctorId }) {
  return api.post('/api/sharing/share', { recordIds, doctorId })
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
