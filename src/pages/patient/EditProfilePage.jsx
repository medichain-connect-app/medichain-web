import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMyProfile, updateFullName } from '../../services/profileService'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'
import { ArrowLeft, Save, User, Shield } from 'lucide-react'

export default function EditProfilePage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { refreshProfile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    getMyProfile()
      .then(p => setName(p.full_name || ''))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      await updateFullName(name.trim())
      await refreshProfile()
      toast.success('Profile updated!')
      navigate(-1)
    } catch (err) {
      toast.error(err.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-txt-primary mb-1">Edit Profile</h1>
        <p className="text-sm text-txt-secondary mb-6">Update your personal information</p>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card !p-5">
          <label className="label-text flex items-center gap-1.5">
            <User size={12} /> Full Name
          </label>
          <input className="input mt-2" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex items-center gap-3 px-4 py-3 bg-primary-tint rounded-xl">
          <Shield size={14} className="text-primary flex-shrink-0" />
          <p className="text-[11px] text-txt-secondary">Your email and account details are managed through your authentication provider and cannot be changed here.</p>
        </motion.div>

        <motion.button type="submit" disabled={saving}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="btn-primary w-full py-3.5 text-base" whileTap={{ scale: 0.98 }}>
          {saving
            ? <div className="spinner-sm border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin" />
            : <><Save size={18} /> Save Changes</>
          }
        </motion.button>
      </form>
    </div>
  )
}
