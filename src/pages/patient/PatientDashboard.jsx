import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getMyStats } from '../../services/profileService'
import { getMyAcceptedDoctors } from '../../services/doctorRequestService'
import {
  Upload, FileText, Share2, Shield, Users, Heart, Stethoscope,
  Brain, Eye, Baby, Activity, ArrowRight, Sparkles
} from 'lucide-react'
import { SPECIALIZATIONS } from '../../data/constants'

const specIcons = { 'General Physician': Stethoscope, Cardiologist: Heart, Neurologist: Brain, Ophthalmologist: Eye, Pediatrician: Baby, default: Activity }

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }) }

export default function PatientDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyStats(), getMyAcceptedDoctors(5)])
      .then(([s, d]) => { setStats(s); setDoctors(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const displayName = stats?.fullName || user?.full_name || 'User'

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker rounded-3xl p-8 md:p-10 overflow-hidden">
        {/* Parallax floating elements */}
        <motion.div className="absolute w-48 h-48 rounded-full bg-white/[0.04] -top-16 -right-16"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-28 h-28 rounded-full bg-white/[0.05] bottom-4 left-8"
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] top-8 right-1/3 hidden md:block"
          animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-white/50" />
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Hello, {displayName}</h1>
          <p className="text-white/50 mt-1 text-sm">Your health data, always secure</p>

          <div className="mt-7 flex flex-wrap gap-3">
            {[
              { icon: FileText, label: `${stats?.records ?? 0} Records` },
              { icon: Users, label: `${stats?.doctors ?? 0} Doctors` },
              { icon: Shield, label: 'Encrypted' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm px-4 py-2.5 rounded-full text-white text-sm font-semibold border border-white/[0.06]">
                <Icon size={15} /> {label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { to: '/patient/upload', icon: Upload, label: 'Upload', gradient: 'from-primary to-primary-dark', shadow: 'shadow-primary/20' },
          { to: '/patient/records', icon: FileText, label: 'Records', gradient: 'from-accent-emerald to-emerald-600', shadow: 'shadow-emerald-500/20' },
          { to: '/patient/find-doctors', icon: Share2, label: 'Share', gradient: 'from-accent-violet to-purple-600', shadow: 'shadow-violet-500/20' },
        ].map(({ to, icon: Icon, label, gradient, shadow }, i) => (
          <motion.div key={to} custom={i} variants={fadeUp} initial="hidden" animate="visible">
            <Link to={to} className="card flex flex-col items-center gap-3 py-6 group">
              <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}>
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-sm font-bold text-txt-primary">{label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Specialties */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-txt-primary">Find by Specialty</h2>
          <Link to="/patient/find-doctors" className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {SPECIALIZATIONS.slice(0, 8).map((spec, i) => {
            const Icon = specIcons[spec] || specIcons.default
            return (
              <Link key={spec} to={`/patient/find-doctors?spec=${encodeURIComponent(spec)}`}
                className="flex-shrink-0 w-24 flex flex-col items-center gap-2 py-4 px-2 rounded-2xl bg-surface hover:bg-primary-tint border border-transparent hover:border-primary/15 transition-all duration-400 group">
                <div className="w-11 h-11 rounded-xl bg-primary-tint text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-400 group-hover:shadow-md group-hover:shadow-primary/20">
                  <Icon size={20} />
                </div>
                <span className="text-[11px] font-semibold text-txt-secondary text-center leading-tight">{spec}</span>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Connected doctors */}
      {doctors.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-txt-primary">Your Doctors</h2>
            <Link to="/patient/find-doctors?tab=my" className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {doctors.map((d, i) => (
              <motion.div key={d.doctor_id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                <Link to={`/patient/doctor/${d.doctor?.id}`} className="card flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/15">
                    {(d.doctor?.name || 'D').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-txt-primary truncate">Dr. {d.doctor?.name}</div>
                    <div className="text-xs text-txt-secondary">{d.doctor?.specialization}</div>
                  </div>
                  <ArrowRight size={16} className="text-txt-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
