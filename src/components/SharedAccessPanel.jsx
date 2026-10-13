import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyShares, revokeShare } from '../services/sharingService'
import { useToast } from './Toast'
import { remainingAccess } from '../lib/accessTime'
import { FileText, Clock, ShieldOff, ShieldCheck, Loader, Share2, ArrowRight } from 'lucide-react'

const LEVEL_STYLES = {
  none: 'bg-surface text-txt-secondary',
  ok: 'bg-emerald-50 text-emerald-700',
  soon: 'bg-amber-50 text-amber-700',
  expired: 'bg-red-50 text-accent-red',
}

/** Patient dashboard: which records each doctor can see, time left, and revoke. */
export default function SharedAccessPanel() {
  const [shares, setShares] = useState(null)
  const [revoking, setRevoking] = useState(null)
  const [now, setNow] = useState(Date.now())
  const toast = useToast()

  useEffect(() => {
    getMyShares().then(setShares).catch(() => setShares([]))
  }, [])

  // Keep the countdowns current.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const byDoctor = useMemo(() => {
    const groups = new Map()
    for (const s of shares || []) {
      if (!groups.has(s.doctorId)) {
        groups.set(s.doctorId, {
          doctorId: s.doctorId,
          name: s.doctorName,
          specialization: s.doctorSpecialization,
          hospital: s.doctorHospital,
          items: [],
        })
      }
      groups.get(s.doctorId).items.push(s)
    }
    return [...groups.values()]
  }, [shares])

  async function handleRevoke(share) {
    const doctor = share.doctorName ? `Dr. ${share.doctorName}` : 'this doctor'
    if (!confirm(`Stop sharing "${share.recordTitle}" with ${doctor}? They will lose access right away.`)) return
    setRevoking(share.id)
    try {
      await revokeShare(share.recordId, share.doctorId)
      setShares(prev => prev.filter(s => s.id !== share.id))
      toast.success(share.expired ? 'Removed' : `Access revoked for ${doctor}`)
    } catch (err) {
      toast.error(err.message || 'Could not revoke access')
    } finally {
      setRevoking(null)
    }
  }

  const activeCount = (shares || []).filter(s => !s.expired).length

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="mt-8" aria-labelledby="shared-access-heading">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="shared-access-heading" className="text-lg font-bold text-txt-primary">Who can see your records</h2>
          {shares && shares.length > 0 && (
            <p className="text-xs text-txt-secondary mt-0.5">
              {activeCount} active share{activeCount !== 1 ? 's' : ''} with {byDoctor.length} doctor{byDoctor.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {shares === null ? (
        <div className="card flex justify-center py-8"><div className="spinner" /></div>
      ) : shares.length === 0 ? (
        <div className="card flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary-tint text-primary flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-txt-primary">Your records are private</p>
            <p className="text-xs text-txt-secondary mt-0.5">No doctor can see any of your records right now.</p>
          </div>
          <Link to="/patient/find-doctors" className="btn-secondary text-xs flex-shrink-0">
            <Share2 size={14} /> Share
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {byDoctor.map(group => (
            <div key={group.doctorId} className="card !p-0 overflow-hidden">
              <Link to={`/patient/doctor/${group.doctorId}`}
                className="flex items-center gap-3 px-5 py-4 border-b border-border hover:bg-surface transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/15 flex-shrink-0">
                  {(group.name || 'D').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-txt-primary truncate">Dr. {group.name || 'Unknown doctor'}</p>
                  <p className="text-xs text-txt-secondary truncate">
                    {[group.specialization, group.hospital].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className="text-xs font-semibold text-txt-tertiary flex-shrink-0">
                  {group.items.length} record{group.items.length !== 1 ? 's' : ''}
                </span>
                <ArrowRight size={14} className="text-txt-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>

              <ul className="divide-y divide-border">
                <AnimatePresence initial={false}>
                  {group.items.map(share => {
                    const remaining = remainingAccess(share.expiresAt, now)
                    return (
                      <motion.li key={share.id} layout exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 px-5 py-3">
                        <FileText size={16} className="text-txt-tertiary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${share.expired ? 'text-txt-tertiary' : 'text-txt-primary'}`}>
                            {share.recordTitle}
                          </p>
                          <p className="text-[11px] text-txt-tertiary">
                            Shared {new Date(share.sharedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            {share.expiresAt && !share.expired && (
                              <> · until {new Date(share.expiresAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</>
                            )}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${LEVEL_STYLES[remaining.level]}`}>
                          <Clock size={11} /> {remaining.text}
                        </span>
                        <button type="button" onClick={() => handleRevoke(share)} disabled={revoking === share.id}
                          aria-label={`${share.expired ? 'Remove' : 'Revoke'} access to ${share.recordTitle}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-accent-red bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex-shrink-0">
                          {revoking === share.id ? <Loader size={12} className="animate-spin" /> : <ShieldOff size={12} />}
                          <span className="hidden sm:inline">{share.expired ? 'Remove' : 'Revoke'}</span>
                        </button>
                      </motion.li>
                    )
                  })}
                </AnimatePresence>
              </ul>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  )
}
