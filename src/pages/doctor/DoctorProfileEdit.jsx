import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMyDoctorProfile, upsertDoctorProfile } from '../../services/doctorService'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'
import { SPECIALIZATIONS, STATES_AND_CITIES, LANGUAGES } from '../../data/constants'
import {
  ArrowLeft, Save, Stethoscope, MapPin, GraduationCap, Award,
  DollarSign, Globe, Building, Clock, Sparkles
} from 'lucide-react'

const defaults = {
  name: '', specialization: '', license_number: '', education: '',
  hospital_name: '', experience_years: '', consultation_fee: '',
  available_online: false, state: '', city: '', address: '',
  languages: [], about: '',
}

export default function DoctorProfileEdit() {
  const { user, refreshProfile } = useAuth()
  const [form, setForm] = useState(defaults)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    getMyDoctorProfile()
      .then(doc => {
        if (doc) {
          setForm(prev => ({ ...prev, ...doc, languages: doc.languages || [] }))
          setFullName(doc.profiles?.full_name || user?.full_name || '')
        } else {
          setFullName(user?.full_name || '')
          setForm(prev => ({ ...prev, name: user?.full_name || '' }))
        }
      })
      .catch(() => {
        setFullName(user?.full_name || '')
        setForm(prev => ({ ...prev, name: user?.full_name || '' }))
      })
      .finally(() => setLoading(false))
  }, [])

  function set(key, value) { setForm(prev => ({ ...prev, [key]: value })) }

  function toggleLang(lang) {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name || !form.specialization) { toast.error('Name and specialization are required'); return }
    setSaving(true)
    try {
      await upsertDoctorProfile({
        fullName: fullName || form.name,
        doctor: {
          name: form.name,
          specialization: form.specialization,
          license_number: form.license_number || null,
          education: form.education || null,
          hospital_name: form.hospital_name || null,
          experience_years: form.experience_years ? Number(form.experience_years) : null,
          consultation_fee: form.consultation_fee ? Number(form.consultation_fee) : null,
          available_online: form.available_online,
          state: form.state || null,
          city: form.city || null,
          address: form.address || null,
          languages: form.languages.length > 0 ? form.languages : null,
          about: form.about || null,
        },
      })
      await refreshProfile()
      toast.success('Profile saved!')
      navigate('/doctor/dashboard')
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const cities = form.state ? (STATES_AND_CITIES[form.state] || []) : []

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker rounded-3xl p-7 overflow-hidden mb-6">
        <motion.div className="absolute w-36 h-36 rounded-full bg-white/[0.04] -top-10 -right-10"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-20 h-20 rounded-full bg-white/[0.05] bottom-3 left-6"
          animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={12} className="text-white/50" />
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Profile Setup</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Doctor Profile</h1>
          <p className="text-white/50 mt-1 text-sm">Set up your professional profile</p>
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-5">
        <Section icon={Stethoscope} title="Basic Info" delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Display Name *</label>
              <input className="input mt-1" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. Name" />
            </div>
            <div>
              <label className="label-text">Full Name (Account)</label>
              <input className="input mt-1" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full legal name" />
            </div>
            <div>
              <label className="label-text">Specialization *</label>
              <select className="input mt-1" value={form.specialization} onChange={e => set('specialization', e.target.value)}>
                <option value="">Select</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">License Number</label>
              <input className="input mt-1" value={form.license_number} onChange={e => set('license_number', e.target.value)} placeholder="MCI-XXXX" />
            </div>
          </div>
        </Section>

        <Section icon={GraduationCap} title="Education & Experience" delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Education</label>
              <input className="input mt-1" value={form.education} onChange={e => set('education', e.target.value)} placeholder="MBBS, MD" />
            </div>
            <div>
              <label className="label-text">Years of Experience</label>
              <input className="input mt-1" type="number" min="0" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} />
            </div>
          </div>
        </Section>

        <Section icon={Building} title="Practice" delay={0.2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Hospital / Clinic</label>
              <input className="input mt-1" value={form.hospital_name} onChange={e => set('hospital_name', e.target.value)} placeholder="Hospital name" />
            </div>
            <div>
              <label className="label-text">Consultation Fee (Rs.)</label>
              <input className="input mt-1" type="number" min="0" value={form.consultation_fee} onChange={e => set('consultation_fee', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => set('available_online', !form.available_online)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${form.available_online ? 'bg-primary shadow-md shadow-primary/20' : 'bg-border-strong'}`}>
              <motion.div className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: form.available_online ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
            </motion.button>
            <span className="text-sm text-txt-secondary">Available for online consultations</span>
          </div>
        </Section>

        <Section icon={MapPin} title="Location" delay={0.25}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">State</label>
              <select className="input mt-1" value={form.state} onChange={e => { set('state', e.target.value); set('city', '') }}>
                <option value="">Select state</option>
                {Object.keys(STATES_AND_CITIES).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">City</label>
              <select className="input mt-1" value={form.city} onChange={e => set('city', e.target.value)} disabled={!form.state}>
                <option value="">Select city</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="label-text">Address</label>
            <textarea className="input mt-1" rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address" />
          </div>
        </Section>

        <Section icon={Globe} title="Languages" delay={0.3}>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(l => (
              <motion.button key={l} type="button" whileTap={{ scale: 0.93 }}
                onClick={() => toggleLang(l)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-300 ${
                  form.languages.includes(l)
                    ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
                    : 'border-border text-txt-secondary hover:border-primary/30 hover:bg-primary-tint'
                }`}>
                {l}
              </motion.button>
            ))}
          </div>
        </Section>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <label className="label-text">About</label>
          <textarea className="input mt-1.5" rows={4} value={form.about} onChange={e => set('about', e.target.value)} placeholder="Brief introduction about yourself..." />
        </motion.div>

        <motion.button type="submit" disabled={saving}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="btn-primary w-full py-3.5 text-base" whileTap={{ scale: 0.98 }}>
          {saving
            ? <div className="spinner-sm border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin" />
            : <><Save size={18} /> Save Profile</>
          }
        </motion.button>
      </form>
    </div>
  )
}

function Section({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="card !p-5 hover:shadow-card-hover transition-shadow duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary-tint flex items-center justify-center">
          <Icon size={14} className="text-primary" />
        </div>
        <span className="text-xs font-semibold text-txt-tertiary uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </motion.div>
  )
}
