import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getMyShares, revokeShare } from '../services/sharingService'
import { useToast } from './Toast'
import { remainingAccess } from '../lib/accessTime'
import { FileText, Clock, ShieldOff, ShieldCheck, Loader, Share2, ArrowRight, X, ChevronDown } from 'lucide-react'

const LEVEL_STYLES = {
  none: 'bg-surface text-txt-secondary',
  ok: 'bg-emerald-50 text-emerald-700',
  soon: 'bg-amber-50 text-amber-700',
}

const DATE_FORMAT = { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }

const isExpired = (share, now) => !!share.expiresAt && new Date(share.expiresAt).getTime() <= now

/**
 * Patient dashboard: which doctors can see which records right now, how long
 * for, and revoke. Shares move to "Expired access" the moment they run out.
 */
export default function SharedAccessPanel() {
  const [shares, setShares] = useState(null)
  const [busy, setBusy] = useState(null)
  const [showExpired, setShowExpired] = useState(false)
  const [now, setNow] = useState(Date.now())
  const toast = useToast()

  useEffect(() => {
    getMyShares().then(setShares).catch(() => setShares([]))
  }, [])

  // Keep countdowns current and move shares to "expired" as they run out.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  const { activeByDoctor, expired } = useMemo(() => {
    const groups = new Map()
    const expiredList = []
    for (const s of shares || []) {
      if (isExpired(s, now)) { expiredList.push(s); continue }
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
    expiredList.sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt))
    return { activeByDoctor: [...groups.values()], expired: expiredList }
  }, [shares, now])

  const activeCount = activeByDoctor.reduce((n, g) => n + g.items.length, 0)

  async function handleRevoke(share) {
    const doctor = share.doctorName ? `Dr. ${share.doctorName}` : 'this doctor'
    if (!confirm(`Stop sharing "${share.recordTitle}" with ${doctor}? They will lose access right away.`)) return
    await remove(share, `Access revoked for ${doctor}`)
  }

  // Clearing an expired share marks it revoked, so it leaves this list for good.
  async function handleClear(share) {
    await remove(share, 'Removed from the list')
  }

  async function remove(share, successMessage) {
    setBusy(share.id)
    try {
      await revokeShare(share.recordId, share.doctorId)
      setShares(prev => prev.filter(s => s.id !== share.id))
      toast.success(successMessage)
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setBusy(null)
    }
  }

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="mt-8" aria-labelledby="shared-access-heading">
      <div className="mb-4">
        <h2 id="shared-access-heading" className="text-lg font-bold text-txt-primary">Who can see your records</h2>
        {shares && activeCount > 0 && (
          <p className="text-xs text-txt-secondary mt-0.5">
            {activeCount} record{activeCount !== 1 ? 's' : ''} shared with {activeByDoctor.length} doctor{activeByDoctor.length !== 1 ? 's' : ''} right now
          </p>
        )}
      </div>

      {shares === null ? (
        <div className="card flex justify-center py-8"><div className="spinner" /></div>
      ) : (
        <>
          {activeByDoctor.length === 0 ? (
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
              {activeByDoctor.map(group => (
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
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex-shrink-0">
                      <ShieldCheck size={11} /> Can see {group.items.length}
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
                              <p className="text-sm font-semibold text-txt-primary truncate">{share.recordTitle}</p>
                              <p className="text-[11px] text-txt-tertiary">
                                Shared {new Date(share.sharedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                {share.expiresAt && <> · until {new Date(share.expiresAt).toLocaleString('en-IN', DATE_FORMAT)}</>}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${LEVEL_STYLES[remaining.level]}`}>
                              <Clock size={11} /> {remaining.text}
                            </span>
                            <button type="button" onClick={() => handleRevoke(share)} disabled={busy === share.id}
                              aria-label={`Revoke access to ${share.recordTitle}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg text-accent-red bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 flex-shrink-0">
                              {busy === share.id ? <Loader size={12} className="animate-spin" /> : <ShieldOff size={12} />}
                              <span className="hidden sm:inline">Revoke</span>
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

          {expired.length > 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-border-strong bg-surface">
              <button type="button" onClick={() => setShowExpired(v => !v)} aria-expanded={showExpired}
                className="w-full flex items-center gap-2 px-5 py-3 text-left">
                <Clock size={14} className="text-txt-tertiary" />
                <span className="flex-1 text-sm font-semibold text-txt-secondary">
                  Expired access ({expired.length})
                  <span className="font-normal text-txt-tertiary"> · these doctors can no longer see these records</span>
                </span>
                <ChevronDown size={16} className={`text-txt-tertiary transition-transform ${showExpired ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {showExpired && (
                  <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden divide-y divide-border border-t border-border">
                    {expired.map(share => (
                      <li key={share.id} className="flex items-center gap-3 px-5 py-3">
                        <FileText size={16} className="text-txt-tertiary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-txt-secondary truncate">
                            {share.recordTitle}
                            <span className="text-txt-tertiary"> · Dr. {share.doctorName || 'Unknown'}</span>
                          </p>
                          <p className="text-[11px] text-txt-tertiary">
                            Expired {new Date(share.expiresAt).toLocaleString('en-IN', DATE_FORMAT)}
                          </p>
                        </div>
                        <Link to={`/patient/send-records/${share.doctorId}`}
                          className="text-xs font-semibold text-primary hover:underline flex-shrink-0">
                          Share again
                        </Link>
                        <button type="button" onClick={() => handleClear(share)} disabled={busy === share.id}
                          aria-label={`Remove ${share.recordTitle} from expired list`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-txt-tertiary hover:bg-white hover:text-txt-secondary transition-colors disabled:opacity-50 flex-shrink-0">
                          {busy === share.id ? <Loader size={12} className="animate-spin" /> : <X size={14} />}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </motion.section>
  )
}
