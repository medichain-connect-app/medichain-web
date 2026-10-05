import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getDoctor } from '../../services/doctorService'
import { getConnectionStatus, requestConnection } from '../../services/doctorRequestService'
import { useToast } from '../../components/Toast'
import {
  ArrowLeft, MapPin, GraduationCap, Award, Clock, DollarSign,
  Globe, Share2, Calendar, UserPlus, Check, Loader, Stethoscope, Wifi
} from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }) }

export default function DoctorProfileView() {
  const { doctorId } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [status, setStatus] = useState('none')
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    Promise.all([getDoctor(doctorId), getConnectionStatus(doctorId)])
      .then(([doc, s]) => { setDoctor(doc); setStatus(s) })
      .catch(() => toast.error('Failed to load doctor'))
      .finally(() => setLoading(false))
  }, [doctorId])

  async function handleConnect() {
    setConnecting(true)
    try {
      await requestConnection(doctorId)
      setStatus('pending')
      toast.success('Connection request sent!')
    } catch (err) {
      toast.error(err.message || 'Failed to send request')
    } finally {
      setConnecting(false)
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>
  if (!doctor) return <div className="text-center py-20 text-txt-secondary">Doctor not found</div>

  const location = [doctor.city, doctor.state].filter(Boolean).join(', ')

  const infoItems = [
    { icon: GraduationCap, label: 'Education', value: doctor.education },
    { icon: Award, label: 'License', value: doctor.license_number },
    { icon: Clock, label: 'Experience', value: doctor.experience_years ? `${doctor.experience_years} years` : null },
    { icon: DollarSign, label: 'Fee', value: doctor.consultation_fee ? `Rs. ${doctor.consultation_fee}` : null },
    { icon: MapPin, label: 'Hospital', value: doctor.hospital_name },
    { icon: Globe, label: 'Online', value: doctor.available_online ? 'Available' : 'In-person only' },
  ].filter(f => f.value)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark rounded-3xl p-8 md:p-10 overflow-hidden">
        <motion.div className="absolute w-44 h-44 rounded-full bg-white/[0.04] -top-14 -right-14"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-24 h-24 rounded-full bg-white/[0.05] bottom-2 left-6"
          animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] top-6 right-1/3 hidden md:block"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shadow-xl border border-white/10">
            {(doctor.name || 'D').charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Dr. {doctor.name}</h1>
            <p className="text-white/80 flex items-center gap-1.5 mt-1"><Stethoscope size={14} /> {doctor.specialization}</p>
            {location && <p className="text-white/60 text-sm flex items-center gap-1.5 mt-0.5"><MapPin size={12} /> {location}</p>}
            {doctor.available_online && (
              <div className="inline-flex items-center gap-1.5 mt-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Wifi size={11} className="text-emerald-300" />
                <span className="text-[11px] font-semibold text-white/80">Online Available</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-3 mt-5">
        {infoItems.map(({ icon: Icon, label, value }, i) => (
          <motion.div key={label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
            className="card !p-4 hover:shadow-card-hover transition-shadow duration-500">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-primary-tint flex items-center justify-center">
                <Icon size={13} className="text-primary" />
              </div>
              <span className="text-[10px] font-semibold text-txt-tertiary uppercase tracking-wide">{label}</span>
            </div>
            <div className="text-sm font-bold text-txt-primary">{value}</div>
          </motion.div>
        ))}
      </motion.div>

      {doctor.languages?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mt-4 card !p-4">
          <span className="text-[10px] font-semibold text-txt-tertiary uppercase tracking-wide">Languages</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {doctor.languages.map(l => <span key={l} className="badge badge-primary">{l}</span>)}
          </div>
        </motion.div>
      )}

      {doctor.about && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-4 card !p-4">
          <span className="text-[10px] font-semibold text-txt-tertiary uppercase tracking-wide">About</span>
          <p className="text-sm text-txt-secondary mt-2 leading-relaxed">{doctor.about}</p>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="mt-6 space-y-3">
        {status === 'none' && (
          <motion.button onClick={handleConnect} disabled={connecting}
            className="btn-primary w-full py-3.5 text-base" whileTap={{ scale: 0.98 }}>
            {connecting ? <Loader size={18} className="animate-spin" /> : <UserPlus size={18} />} Request Connection
          </motion.button>
        )}
        {status === 'pending' && (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="flex items-center justify-center gap-2 py-3.5 bg-amber-50 text-amber-600 rounded-2xl font-semibold border border-amber-200">
            <Clock size={18} /> Connection Pending
          </motion.div>
        )}
        {status === 'accepted' && (
          <div className="space-y-3">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-50 to-green-50 text-success rounded-2xl font-semibold border border-emerald-200">
              <Check size={18} /> Connected
            </motion.div>
            <div className="grid grid-cols-2 gap-3">
              <Link to={`/patient/send-records/${doctorId}`}
                className="btn-outline py-3 justify-center text-sm hover:bg-primary-tint transition-colors">
                <Share2 size={16} /> Share Records
              </Link>
              <Link to={`/patient/book-appointment/${doctorId}`}
                className="btn-primary py-3 justify-center text-sm">
                <Calendar size={16} /> Book Appointment
              </Link>
            </div>
          </div>
        )}
        {status === 'rejected' && (
          <div className="flex items-center justify-center gap-2 py-3.5 bg-red-50 text-accent-red rounded-2xl font-semibold border border-red-200">
            Request Declined
          </div>
        )}
      </motion.div>
    </div>
  )
}
