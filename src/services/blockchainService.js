import { api } from '../lib/api'

/** On-chain audit log for a record: granted / revoked / viewed / downloaded. */
export async function getAccessLog(recordId) {
  return api.get('/api/blockchain/access-log', { recordUuid: recordId })
}

/** Network name, contract address and block explorer URL. */
export async function getChainInfo() {
  return api.get('/api/blockchain/info')
}
