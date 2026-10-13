import { api } from '../lib/api'

/**
 * Audit log for a record: granted / revoked / viewed / downloaded from the chain,
 * plus "expired" entries derived from each grant's on-chain expiry.
 */
export async function getAccessLog(recordId) {
  return api.get('/api/blockchain/access-log', { recordUuid: recordId, withExpiry: '1' })
}

/** Network name, contract address and block explorer URL. */
export async function getChainInfo() {
  return api.get('/api/blockchain/info')
}
