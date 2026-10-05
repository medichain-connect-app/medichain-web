import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard, FileText, Upload, Search, User,
  Stethoscope, Menu, X, LogOut
} from 'lucide-react'

const patientLinks = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/records', label: 'Records', icon: FileText },
  { to: '/patient/upload', label: 'Upload', icon: Upload },
  { to: '/patient/find-doctors', label: 'Doctors', icon: Search },
  { to: '/patient/profile', label: 'Profile', icon: User },
]

const doctorLinks = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/profile-edit', label: 'My Profile', icon: Stethoscope },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  if (!user) return null
  const links = user.role === 'doctor' ? doctorLinks : patientLinks
  const homeLink = user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to={homeLink} className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="MediChain" className="h-7 sm:h-8 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    active ? 'text-primary' : 'text-txt-secondary hover:text-txt-primary hover:bg-surface'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                  {active && (
                    <motion.div layoutId="nav-pill" className="absolute inset-0 bg-primary-tint rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                  )}
                </Link>
              )
            })}
            <div className="w-px h-6 bg-border mx-2" />
            <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-txt-tertiary hover:text-accent-red rounded-xl hover:bg-red-50 transition-all duration-300">
              <LogOut size={16} />
            </button>
          </div>

          <button className="md:hidden p-2 rounded-xl hover:bg-surface transition" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed inset-x-0 top-16 z-50 md:hidden bg-white/95 backdrop-blur-2xl border-b border-border shadow-float"
            >
              <div className="p-4 flex flex-col gap-1">
                {links.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to
                  return (
                    <Link key={to} to={to} onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        active ? 'text-primary bg-primary-tint' : 'text-txt-secondary hover:bg-surface'
                      }`}
                    >
                      <Icon size={18} /> {label}
                    </Link>
                  )
                })}
                <div className="h-px bg-border my-1" />
                <button onClick={() => { signOut(); setOpen(false) }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-accent-red hover:bg-red-50 transition-all duration-300">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  )
}
