import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getDoctor } from '../../services/doctorService'
import { listMyRecords } from '../../services/recordsService'
import { shareRecords, getSharedRecordIds } from '../../services/sharingService'
import { useToast } from '../../components/Toast'
import { ArrowLeft, Share2, FileText, CheckCircle, Check, Shield, Lock } from 'lucide-react'

export default function SendRecordsPage() {
  const { doctorId } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [records, setRecords] = useState([])
  const [sharedIds, setSharedIds] = useState(new Set())
  const [selected, setSelected] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    Promise.all([getDoctor(doctorId), listMyRecords(), getSharedRecordIds(doctorId)])
      .then(([doc, recs, shared]) => { setDoctor(doc); setRecords(recs); setSharedIds(shared) })
      .catch(() => { toast.error('Failed to load'); navigate(-1) })
      .finally(() => setLoading(false))
  }, [doctorId])

  function toggle(id) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function selectAll() {
    const unshared = records.filter(r => !sharedIds.has(r.id))
    setSelected(prev => prev.size === unshared.length ? new Set() : new Set(unshared.map(r => r.id)))
  }

  async function handleSend() {
    if (selected.size === 0) { toast.error('Select at least one record'); return }
    setSending(true)
    try {
      await shareRecords({ recordIds: [...selected], doctorId })
      setDone(true)
      toast.success(`${selected.size} record(s) shared!`)
    } catch (err) {
      toast.error(err.message || 'Failed to share')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold text-txt-primary">Records Shared!</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-txt-secondary mt-2">{selected.size} record(s) securely shared with Dr. {doctor?.name}.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-3 text-[11px] text-txt-tertiary">
          <Lock size={10} className="text-success" /> Encrypted with AES-256
        </motion.div>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          onClick={() => navigate('/patient/dashboard')} className="btn-primary mt-8">Back to Dashboard</motion.button>
      </div>
    )
  }

  const unshared = records.filter(r => !sharedIds.has(r.id))

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-txt-primary mb-1">Share Records</h1>
        {doctor && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              {(doctor.name || 'D').charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-txt-primary">Dr. {doctor.name}</p>
              <p className="text-xs text-txt-secondary flex items-center gap-1"><Shield size={10} className="text-success" /> Encrypted sharing</p>
            </div>
          </div>
        )}
      </motion.div>

      {sharedIds.size > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl mb-5">
          <div className="w-8 h-8 rounded-lg bg-success text-white flex items-center justify-center flex-shrink-0 shadow-sm"><Check size={16} /></div>
          <p className="text-sm text-green-800 font-medium">{sharedIds.size} record(s) already shared with this doctor.</p>
        </motion.div>
      )}

      {unshared.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-3xl bg-primary-tint text-primary flex items-center justify-center mx-auto mb-4"><FileText size={28} /></div>
          <h3 className="text-lg font-bold text-txt-primary">{records.length === 0 ? 'No records to share' : 'All records shared'}</h3>
          <p className="text-sm text-txt-secondary mt-2">{records.length === 0 ? 'Upload some medical records first.' : 'All your records are already shared with this doctor.'}</p>
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-txt-secondary">{selected.size} of {unshared.length} selected</p>
            <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={selectAll}
              className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
              {selected.size === unshared.length ? 'Deselect all' : 'Select all'}
            </motion.button>
          </div>
          <div className="space-y-2">
            {unshared.map((rec, i) => (
              <motion.label key={rec.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selected.has(rec.id) ? 'border-primary bg-primary-tint shadow-sm' : 'border-border hover:border-primary/30 hover:bg-surface'
                }`}
              >
                <input type="checkbox" checked={selected.has(rec.id)} onChange={() => toggle(rec.id)} className="sr-only" />
                <motion.div whileTap={{ scale: 0.8 }}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                    selected.has(rec.id) ? 'border-primary bg-primary shadow-sm shadow-primary/20' : 'border-border-strong'
                  }`}>
                  <AnimatePresence>
                    {selected.has(rec.id) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={14} className="text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <div className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center flex-shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-txt-primary truncate">{rec.title}</div>
                  {rec.category && <span className="badge badge-gray text-[10px] mt-1">{rec.category}</span>}
                </div>
              </motion.label>
            ))}
          </div>

          <motion.button onClick={handleSend} disabled={sending || selected.size === 0}
            className="btn-primary w-full py-3.5 text-base mt-6" whileTap={{ scale: 0.98 }}>
            {sending
              ? <div className="spinner-sm border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin" />
              : <><Share2 size={18} /> Share {selected.size} Record{selected.size !== 1 ? 's' : ''}</>
            }
          </motion.button>
        </>
      )}
    </div>
  )
}
