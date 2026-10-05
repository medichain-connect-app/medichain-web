import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { uploadRecord } from '../../services/recordsService'
import { useToast } from '../../components/Toast'
import { RECORD_CATEGORIES } from '../../data/constants'
import { ArrowLeft, Upload, FileText, CheckCircle, CloudUpload, Shield, Lock, Sparkles } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef()
  const navigate = useNavigate()
  const toast = useToast()

  function handleFile(f) {
    if (!f) return
    if (f.size > 50 * 1024 * 1024) { toast.error('File must be under 50 MB'); return }
    setFile(f)
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file || !title || !category) { toast.error('Fill in all fields'); return }
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => setProgress(p => Math.min(p + Math.random() * 15, 90)), 400)
    try {
      await uploadRecord(file, title, category)
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => setDone(true), 400)
      toast.success('Record uploaded and encrypted!')
    } catch (err) {
      clearInterval(interval)
      setProgress(0)
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="inline-flex">
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-2xl font-extrabold text-txt-primary">Upload Complete!</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-txt-secondary mt-2">Your record has been encrypted with AES-256 and stored securely on IPFS.</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-8 flex gap-3 justify-center">
          <button onClick={() => navigate('/patient/records')} className="btn-primary">View Records</button>
          <button onClick={() => { setFile(null); setTitle(''); setCategory(''); setDone(false); setProgress(0) }}
            className="btn-outline">Upload Another</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-txt-primary mb-1">Upload Record</h1>
        <p className="text-sm text-txt-secondary mb-6 flex items-center gap-1.5">
          <Lock size={12} className="text-success" /> End-to-end encrypted before storage
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
          onClick={() => fileRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-500 relative overflow-hidden ${
            dragOver ? 'border-primary bg-primary-tint scale-[1.02]'
              : file ? 'border-success bg-gradient-to-br from-emerald-50 to-green-50'
              : 'border-border hover:border-primary/40 hover:bg-surface'
          }`}
        >
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx,.xls,.xlsx" onChange={e => handleFile(e.target.files[0])} />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <FileText size={28} className="text-white" />
                </div>
                <span className="font-bold text-sm text-txt-primary">{file.name}</span>
                <span className="text-xs text-txt-tertiary">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <span className="text-[11px] text-primary font-semibold">Click to change file</span>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <CloudUpload size={32} className="text-primary" />
                </motion.div>
                <span className="text-sm font-semibold text-txt-primary">Drop file here or click to browse</span>
                <span className="text-xs text-txt-tertiary">PDF, Images, Docs — up to 50 MB</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="label-text">Title</label>
          <input className="input mt-1.5" placeholder="Blood Test Report" value={title} onChange={e => setTitle(e.target.value)} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="label-text">Category</label>
          <select className="input mt-1.5" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {RECORD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </motion.div>

        <AnimatePresence>
          {uploading && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="bg-surface rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-txt-secondary flex items-center gap-1.5">
                    <Shield size={12} className="text-primary" /> Encrypting & uploading...
                  </span>
                  <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                    animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button type="submit" disabled={uploading}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="btn-primary w-full py-3.5 text-base" whileTap={{ scale: 0.98 }}>
          {uploading
            ? <div className="flex items-center gap-2"><div className="spinner-sm border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin" /> Encrypting...</div>
            : <><Upload size={18} /> Upload Record</>
          }
        </motion.button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-[11px] text-txt-tertiary">
          <Sparkles size={10} className="text-primary" />
          <span>AES-256-CBC encryption · IPFS decentralized storage</span>
        </motion.div>
      </form>
    </div>
  )
}
