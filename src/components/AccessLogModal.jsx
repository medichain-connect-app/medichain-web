import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, ShieldOff, Eye, Download, Link2, ExternalLink, History } from 'lucide-react'
import { getAccessLog, getChainInfo } from '../services/blockchainService'

const ACTIONS = {
  granted: { label: 'Access granted', icon: ShieldCheck, tint: 'bg-emerald-50 text-emerald-600' },
  revoked: { label: 'Access revoked', icon: ShieldOff, tint: 'bg-red-50 text-accent-red' },
  viewed: { label: 'Viewed', icon: Eye, tint: 'bg-primary-tint text-primary' },
  downloaded: { label: 'Downloaded', icon: Download, tint: 'bg-violet-50 text-accent-violet' },
}

function shortAddress(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''
}

/** Shows a record's tamper-proof access history, read from the blockchain. */
export default function AccessLogModal({ record, onClose }) {
  const [entries, setEntries] = useState(null)
  const [chain, setChain] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getAccessLog(record.id), getChainInfo().catch(() => null)])
      .then(([log, info]) => {
        setEntries([...log].reverse())
        setChain(info)
      })
      .catch(err => setError(err.message || 'Could not load the access history'))
  }, [record.id])

  const explorerAddress = chain?.explorerUrl && chain?.contractAddress
    ? `${chain.explorerUrl}/address/${chain.contractAddress}`
    : null

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div role="dialog" aria-modal="true" aria-labelledby="access-log-title"
          className="w-full sm:max-w-lg max-h-[85vh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-float overflow-hidden"
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          onClick={e => e.stopPropagation()}>

          <div className="flex items-start gap-3 p-5 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center flex-shrink-0">
              <History size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="access-log-title" className="font-extrabold text-txt-primary">Access history</h2>
              <p className="text-xs text-txt-secondary truncate">{record.title}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center text-txt-tertiary">
              <X size={18} />
            </button>
          </div>

          <div className="px-5 py-3 bg-surface border-b border-border flex items-center gap-2 text-[11px] text-txt-secondary">
            <Link2 size={13} className="text-primary flex-shrink-0" />
            <span className="flex-1">
              Recorded on {chain?.network || 'the blockchain'}. Entries can't be edited or deleted, by anyone.
            </span>
            {explorerAddress && (
              <a href={explorerAddress} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline flex-shrink-0">
                Verify <ExternalLink size={11} />
              </a>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {error ? (
              <p className="text-sm text-accent-red text-center py-8">{error}</p>
            ) : entries === null ? (
              <div className="flex justify-center py-10"><div className="spinner" /></div>
            ) : entries.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-bold text-txt-primary">No activity yet</p>
                <p className="text-sm text-txt-secondary mt-1">When you share this record with a doctor, it shows up here.</p>
              </div>
            ) : (
              <ol className="space-y-3">
                {entries.map((e, i) => {
                  const cfg = ACTIONS[e.action] || ACTIONS.granted
                  const Icon = cfg.icon
                  return (
                    <li key={`${e.blockNumber}-${i}`} className="flex gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.tint}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-txt-primary">
                          {cfg.label}
                          <span className="font-normal text-txt-secondary">
                            {e.action === 'granted' || e.action === 'revoked' ? ' for ' : ' by '}
                            {e.doctorName ? `Dr. ${e.doctorName.replace(/^Dr\.?\s*/i, '')}` : shortAddress(e.doctorAddress)}
                          </span>
                        </p>
                        <p className="text-[11px] text-txt-tertiary mt-0.5">
                          {new Date(e.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          {' · '}block {e.blockNumber.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
