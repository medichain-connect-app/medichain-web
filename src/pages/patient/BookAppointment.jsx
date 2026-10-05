import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getDoctor } from '../../services/doctorService'
import { requestAppointment, hasExistingRequest } from '../../services/appointmentService'
import { useToast } from '../../components/Toast'
import { ArrowLeft, Calendar, Clock, CheckCircle, Mail, Stethoscope } from 'lucide-react'

const TIMES = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM', '05:30 PM',
]

export default function BookAppointment() {
  const { doctorId } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [existing, setExisting] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    Promise.all([getDoctor(doctorId), hasExistingRequest(doctorId)])
      .then(([doc, exists]) => { setDoctor(doc); setExisting(exists) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [doctorId])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!date || !time) { toast.error('Select date and time'); return }
    setSubmitting(true)
    try {
      await requestAppointment({ doctorId, preferredDate: date, preferredTime: time, notes })
      setDone(true)
      toast.success('Appointment requested!')
    } catch (err) {
      toast.error(err.message || 'Failed to book')
    } finally {
      setSubmitting(false)
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
          className="text-2xl font-extrabold text-txt-primary">Appointment Requested!</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-txt-secondary mt-2">Dr. {doctor?.name} will confirm your appointment soon.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mt-3 text-sm text-primary font-medium">
          <Mail size={14} /> You'll receive an email confirmation
        </motion.div>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          onClick={() => navigate('/patient/dashboard')} className="btn-primary mt-8">Back to Dashboard</motion.button>
      </div>
    )
  }

  if (existing) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
          <ArrowLeft size={18} /> Back
        </button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/15">
            <Clock size={32} />
          </div>
          <h3 className="text-lg font-bold text-txt-primary">Request Already Pending</h3>
          <p className="text-sm text-txt-secondary mt-2">You already have a pending appointment request with Dr. {doctor?.name}.</p>
        </motion.div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-txt-primary mb-1">Book Appointment</h1>
        {doctor && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold shadow-md shadow-primary/20">
              {(doctor.name || 'D').charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-txt-primary">Dr. {doctor.name}</p>
              <p className="text-xs text-txt-secondary flex items-center gap-1"><Stethoscope size={10} /> {doctor.specialization}</p>
            </div>
          </div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card !p-5">
          <label className="label-text flex items-center gap-1.5">
            <Calendar size={12} /> Preferred Date
          </label>
          <input type="date" className="input mt-2" min={today} value={date} onChange={e => setDate(e.target.value)} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="card !p-5">
          <label className="label-text flex items-center gap-1.5 mb-3">
            <Clock size={12} /> Preferred Time
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {TIMES.map(t => (
              <motion.button key={t} type="button" whileTap={{ scale: 0.93 }}
                onClick={() => setTime(t)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all duration-300 ${
                  time === t
                    ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                    : 'border-border hover:border-primary/30 hover:bg-primary-tint text-txt-secondary'
                }`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="label-text">Notes (optional)</label>
          <textarea className="input mt-1.5" rows={3} placeholder="Describe your symptoms or reason for visit..." value={notes} onChange={e => setNotes(e.target.value)} />
        </motion.div>

        <motion.button type="submit" disabled={submitting}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="btn-primary w-full py-3.5 text-base" whileTap={{ scale: 0.98 }}>
          {submitting
            ? <div className="spinner-sm border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin" />
            : <><Calendar size={18} /> Request Appointment</>
          }
        </motion.button>
      </form>
    </div>
  )
}
