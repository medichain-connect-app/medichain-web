import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Shield, LogOut, Users, FileText, Activity, Sparkles } from 'lucide-react'
import { useToast } from '../../components/Toast'

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  function handleSignOut() {
    signOut()
    navigate('/login')
    toast.success('Signed out')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 rounded-3xl p-8 md:p-10 overflow-hidden mb-6">
        <motion.div className="absolute w-48 h-48 rounded-full bg-white/[0.04] -top-16 -right-16"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-28 h-28 rounded-full bg-white/[0.05] bottom-4 left-8"
          animate={{ y: [0, -18, 0], x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] top-8 right-1/3 hidden md:block"
          animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-xl">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles size={12} className="text-white/50" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Admin</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-white/50 mt-1 text-sm">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Users, label: 'Users', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
          { icon: FileText, label: 'Records', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
          { icon: Activity, label: 'Activity', color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
        ].map(({ icon: Icon, label, color, shadow }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
            className="card !p-5 text-center hover:shadow-card-hover transition-shadow duration-500">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-lg ${shadow}`}>
              <Icon size={20} className="text-white" />
            </div>
            <span className="text-sm font-bold text-txt-primary">{label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card !p-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 text-purple-500 flex items-center justify-center mx-auto mb-4">
          <Shield size={28} />
        </div>
        <h3 className="text-lg font-bold text-txt-primary">Admin Panel</h3>
        <p className="text-sm text-txt-secondary mt-2 max-w-md mx-auto leading-relaxed">
          Admin features like doctor verification, user management, and analytics can be configured through the backend admin routes.
        </p>
      </motion.div>

      <motion.button onClick={handleSignOut}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="w-full mt-6 py-3.5 text-base rounded-2xl font-bold flex items-center justify-center gap-2 bg-red-50 text-accent-red border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all duration-300"
        whileTap={{ scale: 0.98 }}>
        <LogOut size={18} /> Sign Out
      </motion.button>
    </div>
  )
}
