import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { listDoctors } from '../../services/doctorService'
import { getMyAcceptedDoctors } from '../../services/doctorRequestService'
import { useToast } from '../../components/Toast'
import { SPECIALIZATIONS, STATES_AND_CITIES } from '../../data/constants'
import { Search, MapPin, ArrowRight, Stethoscope, Users, Wifi, Building, Filter } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }) }

export default function FindDoctorsPage() {
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'browse')
  const [doctors, setDoctors] = useState([])
  const [myDoctors, setMyDoctors] = useState([])
  const [search, setSearch] = useState('')
  const [spec, setSpec] = useState(searchParams.get('spec') || '')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    setLoading(true)
    if (tab === 'browse') {
      listDoctors(spec ? { specialization: spec } : undefined)
        .then(setDoctors).catch(() => toast.error('Failed to load'))
        .finally(() => setLoading(false))
    } else {
      getMyAcceptedDoctors(100)
        .then(setMyDoctors).catch(() => toast.error('Failed to load'))
        .finally(() => setLoading(false))
    }
  }, [tab, spec])

  const filtered = doctors.filter(d => {
    if (search && !d.name?.toLowerCase().includes(search.toLowerCase())) return false
    if (state && d.state !== state) return false
    if (city && d.city !== city) return false
    return true
  })

  const cities = state ? (STATES_AND_CITIES[state] || []) : []

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary via-primary-dark to-primary-darker rounded-3xl p-7 md:p-8 overflow-hidden mb-6">
        <motion.div className="absolute w-44 h-44 rounded-full bg-white/[0.04] -top-14 -right-14"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-24 h-24 rounded-full bg-white/[0.05] bottom-4 left-6"
          animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Find Doctors</h1>
          <p className="text-white/50 mt-1 text-sm">Connect with verified healthcare professionals</p>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {[
          { id: 'browse', icon: Search, label: 'Browse' },
          { id: 'my', icon: Users, label: 'My Doctors' },
        ].map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.97 }} onClick={() => setTab(t.id)}
            className={`tab flex items-center gap-1.5 ${tab === t.id ? 'active' : ''}`}>
            <t.icon size={14} /> {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'browse' && (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="card !p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={14} className="text-primary" />
                <span className="text-xs font-semibold text-txt-tertiary uppercase tracking-wide">Filters</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                  <input className="input pl-10 text-sm" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select className="input text-sm" value={spec} onChange={e => setSpec(e.target.value)}>
                  <option value="">All Specializations</option>
                  {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="input text-sm" value={state} onChange={e => { setState(e.target.value); setCity('') }}>
                  <option value="">All States</option>
                  {Object.keys(STATES_AND_CITIES).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="input text-sm" value={city} onChange={e => setCity(e.target.value)} disabled={!state}>
                  <option value="">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </motion.div>

            {loading ? <div className="py-16 flex justify-center"><div className="spinner" /></div> : (
              filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-16 h-16 rounded-3xl bg-primary-tint text-primary flex items-center justify-center mx-auto mb-4"><Stethoscope size={28} /></div>
                  <h3 className="text-lg font-bold text-txt-primary">No doctors found</h3>
                  <p className="text-sm text-txt-secondary mt-2">Try adjusting your filters</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((doc, i) => (
                    <motion.div key={doc.id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <DoctorCard doctor={doc} />
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        )}

        {tab === 'my' && (
          <motion.div key="my" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {loading ? <div className="py-16 flex justify-center"><div className="spinner" /></div> : (
              myDoctors.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-16 h-16 rounded-3xl bg-primary-tint text-primary flex items-center justify-center mx-auto mb-4"><Users size={28} /></div>
                  <h3 className="text-lg font-bold text-txt-primary">No connected doctors</h3>
                  <p className="text-sm text-txt-secondary mt-2">Browse and connect with doctors.</p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setTab('browse')}
                    className="btn-primary mt-4"><Search size={16} /> Browse Doctors</motion.button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myDoctors.map((d, i) => (
                    <motion.div key={d.doctor_id} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                      <DoctorCard doctor={d.doctor} connected />
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DoctorCard({ doctor, connected }) {
  if (!doctor) return null
  return (
    <Link to={`/patient/doctor/${doctor.id}`}
      className="card group flex items-center gap-4 hover:border-primary/20 hover:shadow-card-hover transition-all duration-500">
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-500">
          {(doctor.name || 'D').charAt(0)}
        </div>
        {doctor.available_online && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-success flex items-center justify-center shadow-sm">
            <Wifi size={10} className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-txt-primary truncate">Dr. {doctor.name}</div>
        <div className="text-xs text-txt-secondary mt-0.5 flex items-center gap-1">
          <Stethoscope size={10} /> {doctor.specialization}
        </div>
        {doctor.hospital_name && (
          <div className="text-xs text-txt-tertiary mt-0.5 flex items-center gap-1"><Building size={10} /> {doctor.hospital_name}</div>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {doctor.experience_years && <span className="badge badge-primary text-[10px]">{doctor.experience_years} yrs exp</span>}
          {doctor.consultation_fee && <span className="badge badge-gray text-[10px]">Rs. {doctor.consultation_fee}</span>}
          {connected && <span className="badge bg-emerald-50 text-emerald-600 border-emerald-200 text-[10px]">Connected</span>}
        </div>
      </div>
      <ArrowRight size={16} className="text-txt-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
    </Link>
  )
}
