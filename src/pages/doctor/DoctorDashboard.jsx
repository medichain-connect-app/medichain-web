import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getIncomingRequests, getAcceptedPatients, setRequestStatus } from '../../services/doctorRequestService'
import { getPendingAppointments, confirmAppointment, declineAppointment } from '../../services/appointmentService'
import { getMyDoctorProfile } from '../../services/doctorService'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'
import {
  Users, Calendar, UserCheck, Clock, Check, X, Mail,
  FileText, ChevronRight, Stethoscope, AlertCircle, Sparkles, Edit3, Activity
} from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }) }

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('requests')
  const [subTab, setSubTab] = useState('connections')
  const [requests, setRequests] = useState([])
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctorProfile, setDoctorProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [reqs, appts, pats, doc] = await Promise.all([
        getIncomingRequests().catch(() => []),
        getPendingAppointments().catch(() => []),
        getAcceptedPatients().catch(() => []),
        getMyDoctorProfile().catch(() => null),
      ])
      setRequests(reqs)
      setAppointments(appts)
      setPatients(pats)
      setDoctorProfile(doc)
    } finally {
      setLoading(false)
    }
  }

  async function handleRequest(id, status) {
    try {
      await setRequestStatus(id, status)
      setRequests(prev => prev.filter(r => r.id !== id))
      toast.success(status === 'accepted' ? 'Connection accepted' : 'Request declined')
      if (status === 'accepted') loadAll()
    } catch { toast.error('Action failed') }
  }

  async function handleConfirm(appt) {
    const confirmedDate = prompt('Enter confirmed date (YYYY-MM-DD):')
    if (!confirmedDate) return
    const confirmedTime = prompt('Enter confirmed time (e.g. 10:00 AM):')
    if (!confirmedTime) return
    try {
      await confirmAppointment(appt.id, {
        patientEmail: appt.patient?.email || '',
        patientName: appt.patient?.full_name || 'Patient',
        doctorName: doctorProfile?.name || user?.full_name || 'Doctor',
        hospital: doctorProfile?.hospital_name || '',
        confirmedDate,
        confirmedTime,
      })
      setAppointments(prev => prev.filter(a => a.id !== appt.id))
      toast.success('Appointment confirmed & email sent!')
    } catch { toast.error('Failed to confirm') }
  }

  async function handleDecline(id) {
    try {
      await declineAppointment(id)
      setAppointments(prev => prev.filter(a => a.id !== id))
      toast.success('Appointment declined')
    } catch { toast.error('Failed to decline') }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>

  if (!doctorProfile) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/15">
            <AlertCircle size={44} strokeWidth={1.5} />
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold text-txt-primary">Complete Your Profile</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-txt-secondary mt-2">Set up your doctor profile to start receiving patient requests.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link to="/doctor/profile-edit" className="btn-primary mt-6 inline-flex"><Stethoscope size={18} /> Set Up Profile</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker rounded-3xl p-8 md:p-10 overflow-hidden mb-6">
        <motion.div className="absolute w-48 h-48 rounded-full bg-white/[0.04] -top-16 -right-16"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-28 h-28 rounded-full bg-white/[0.05] bottom-4 left-8"
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] top-8 right-1/3 hidden md:block"
          animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-white/50" />
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Dashboard</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Dr. {doctorProfile.name}</h1>
              <p className="text-white/50 mt-1 text-sm">{doctorProfile.specialization}</p>
            </div>
            <Link to="/doctor/profile-edit"
              className="w-10 h-10 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.06] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.15] transition-all duration-300">
              <Edit3 size={16} />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Users, label: `${requests.length} Pending`, gradient: requests.length > 0 ? 'bg-white/[0.12]' : 'bg-white/[0.08]' },
              { icon: Calendar, label: `${appointments.length} Appointments`, gradient: appointments.length > 0 ? 'bg-white/[0.12]' : 'bg-white/[0.08]' },
              { icon: UserCheck, label: `${patients.length} Patients`, gradient: 'bg-white/[0.08]' },
            ].map(({ icon: Icon, label, gradient }) => (
              <div key={label} className={`flex items-center gap-2 ${gradient} backdrop-blur-sm px-4 py-2.5 rounded-full text-white text-sm font-semibold border border-white/[0.06]`}>
                <Icon size={15} /> {label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {[
          { id: 'requests', icon: Activity, label: 'Requests' },
          { id: 'patients', icon: UserCheck, label: 'Patients' },
        ].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.97 }} onClick={() => setTab(t.id)}
            className={`tab flex items-center gap-1.5 ${tab === t.id ? 'active' : ''}`}>
            <t.icon size={14} /> {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'requests' && (
          <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex gap-2 mb-4">
              {[
                { id: 'connections', icon: Users, label: 'Connections', count: requests.length },
                { id: 'appointments', icon: Calendar, label: 'Appointments', count: appointments.length },
              ].map(st => (
                <motion.button key={st.id} whileTap={{ scale: 0.95 }} onClick={() => setSubTab(st.id)}
                  className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 ${
                    subTab === st.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface text-txt-secondary hover:bg-primary-tint'
                  }`}>
                  <st.icon size={12} /> {st.label}
                  {st.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${subTab === st.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                      {st.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {subTab === 'connections' && (
                <motion.div key="conn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {requests.length === 0 ? (
                    <EmptyState icon={Users} title="No pending requests" subtitle="New connection requests will appear here." />
                  ) : (
                    <div className="space-y-3">
                      {requests.map((req, i) => (
                        <motion.div key={req.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                          className="card !p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {(req.patient?.full_name || 'P').charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-txt-primary truncate">{req.patient?.full_name || 'Patient'}</div>
                            <div className="text-xs text-txt-tertiary mt-0.5">Wants to connect</div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleRequest(req.id, 'accepted')}
                              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 text-success flex items-center justify-center hover:from-emerald-100 hover:to-green-100 transition-all duration-300 border border-emerald-200">
                              <Check size={16} />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleRequest(req.id, 'rejected')}
                              className="w-10 h-10 rounded-xl bg-red-50 text-accent-red flex items-center justify-center hover:bg-red-100 transition-all duration-300 border border-red-200">
                              <X size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {subTab === 'appointments' && (
                <motion.div key="appt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {appointments.length === 0 ? (
                    <EmptyState icon={Calendar} title="No pending appointments" subtitle="Appointment requests will appear here." />
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((appt, i) => (
                        <motion.div key={appt.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                          className="card !p-5 hover:shadow-card-hover transition-shadow duration-500">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {(appt.patient?.full_name || 'P').charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm text-txt-primary truncate">{appt.patient?.full_name || 'Patient'}</div>
                              <div className="text-xs text-txt-tertiary flex items-center gap-1 mt-0.5"><Mail size={10} /> {appt.patient?.email || '—'}</div>
                            </div>
                          </div>
                          <div className="flex gap-3 text-xs text-txt-secondary mb-3">
                            <span className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg"><Calendar size={12} className="text-primary" /> {appt.preferred_date}</span>
                            <span className="flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg"><Clock size={12} className="text-primary" /> {appt.preferred_time}</span>
                          </div>
                          {appt.notes && <p className="text-xs text-txt-secondary bg-surface rounded-xl p-3 mb-3 leading-relaxed">{appt.notes}</p>}
                          <div className="flex gap-2">
                            <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleConfirm(appt)}
                              className="btn-primary flex-1 py-2.5 text-sm">
                              <Check size={14} /> Confirm
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleDecline(appt.id)}
                              className="flex-1 py-2.5 text-sm rounded-xl font-bold flex items-center justify-center gap-1.5 bg-red-50 text-accent-red border border-red-200 hover:bg-red-100 transition-all duration-300">
                              <X size={14} /> Decline
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {tab === 'patients' && (
          <motion.div key="patients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {patients.length === 0 ? (
              <EmptyState icon={UserCheck} title="No patients yet" subtitle="Accepted patients will appear here." />
            ) : (
              <div className="space-y-3">
                {patients.map((p, i) => (
                  <motion.div key={p.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                    <Link to={`/doctor/patient-records/${p.patient_id}`}
                      className="card !p-4 flex items-center gap-4 group hover:border-primary/20 hover:shadow-card-hover transition-all duration-500">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-500 flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:shadow-md group-hover:shadow-emerald-500/10 transition-all duration-500">
                        {(p.patient?.full_name || 'P').charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-txt-primary truncate">{p.patient?.full_name || 'Patient'}</div>
                        <div className="text-xs text-txt-tertiary mt-0.5 flex items-center gap-1"><FileText size={10} /> View shared records</div>
                      </div>
                      <ChevronRight size={16} className="text-txt-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-primary-tint text-primary flex items-center justify-center mx-auto mb-4"><Icon size={28} /></div>
      <h3 className="text-lg font-bold text-txt-primary">{title}</h3>
      <p className="text-sm text-txt-secondary mt-2">{subtitle}</p>
    </motion.div>
  )
}
