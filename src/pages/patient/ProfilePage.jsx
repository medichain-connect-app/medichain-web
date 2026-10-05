import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { getMyStats } from '../../services/profileService'
import { useToast } from '../../components/Toast'
import {
  User, FileText, Users, Share2, Edit3, LogOut, ChevronRight,
  Shield, Sparkles
} from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }) }

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    getMyStats().then(setStats).catch(() => {})
  }, [])

  function handleSignOut() {
    signOut()
    navigate('/login')
    toast.success('Signed out')
  }

  const initial = (user?.full_name || user?.email || 'U').charAt(0).toUpperCase()

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', desc: 'Update your personal info', to: '/patient/edit-profile', color: 'text-primary', bg: 'bg-primary-tint' },
    { icon: FileText, label: 'My Records', desc: 'View all medical records', to: '/patient/records', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Users, label: 'My Doctors', desc: 'Connected healthcare providers', to: '/patient/find-doctors?tab=my', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark rounded-3xl p-8 md:p-10 overflow-hidden">
        <motion.div className="absolute w-44 h-44 rounded-full bg-white/[0.04] -top-14 -right-14"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-24 h-24 rounded-full bg-white/[0.05] bottom-2 left-6"
          animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] top-6 right-1/4 hidden md:block"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold shadow-xl border border-white/10">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles size={12} className="text-white/50" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Profile</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{stats?.fullName || user?.full_name || 'Patient'}</h2>
            <p className="text-white/60 text-sm mt-0.5">{stats?.email || user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white/[0.1] backdrop-blur-sm text-white text-xs font-semibold border border-white/[0.06]">Patient</span>
          </div>
        </div>
      </motion.div>

      {stats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: FileText, label: 'Records', value: stats.records, gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
            { icon: Users, label: 'Doctors', value: stats.doctors, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
            { icon: Share2, label: 'Shared', value: stats.shared, gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
          ].map(({ icon: Icon, label, value, gradient, shadow }, i) => (
            <motion.div key={label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="card !p-4 text-center hover:shadow-card-hover transition-shadow duration-500">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-2 shadow-lg ${shadow}`}>
                <Icon size={18} className="text-white" />
              </div>
              <div className="text-2xl font-extrabold text-txt-primary">{value}</div>
              <div className="text-[10px] font-semibold text-txt-tertiary uppercase tracking-wide mt-0.5">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="mt-5 space-y-2">
        {menuItems.map(({ icon: Icon, label, desc, to, color, bg }, i) => (
          <motion.div key={label} custom={i + 3} variants={fadeUp} initial="hidden" animate="visible">
            <Link to={to}
              className="card !p-4 flex items-center gap-4 group hover:border-primary/20 hover:shadow-card-hover transition-all duration-500">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-sm text-txt-primary block">{label}</span>
                <span className="text-[11px] text-txt-tertiary">{desc}</span>
              </div>
              <ChevronRight size={16} className="text-txt-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-5 card !p-5 bg-gradient-to-r from-primary/[0.03] to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-tint flex items-center justify-center">
            <Shield size={14} className="text-primary" />
          </div>
          <span className="text-xs font-semibold text-txt-tertiary uppercase tracking-wide">Security</span>
        </div>
        <p className="text-xs text-txt-secondary leading-relaxed">
          Your medical records are encrypted with AES-256-CBC and stored on IPFS. Only you control who can access your data.
        </p>
      </motion.div>

      <motion.button onClick={handleSignOut}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        className="w-full mt-6 py-3.5 text-base rounded-2xl font-bold flex items-center justify-center gap-2 bg-red-50 text-accent-red border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all duration-300"
        whileTap={{ scale: 0.98 }}>
        <LogOut size={18} /> Sign Out
      </motion.button>
    </div>
  )
}
