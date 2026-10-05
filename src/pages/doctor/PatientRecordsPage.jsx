import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getRecordsSharedWithMe } from '../../services/sharingService'
import { downloadRecord } from '../../services/recordsService'
import { useToast } from '../../components/Toast'
import { ArrowLeft, FileText, Download, Loader, FolderOpen, Shield } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }) }

export default function PatientRecordsPage() {
  const { patientId } = useParams()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    getRecordsSharedWithMe(patientId)
      .then(setRecords)
      .catch(() => toast.error('Failed to load records'))
      .finally(() => setLoading(false))
  }, [patientId])

  async function handleDownload(rec) {
    setDownloading(rec.id)
    try {
      const blob = await downloadRecord(rec.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = rec.title || 'record'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Downloaded!')
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(null)
    }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-txt-secondary hover:text-primary transition-colors mb-5">
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-txt-primary mb-1">Shared Records</h1>
        <p className="text-sm text-txt-secondary mb-6 flex items-center gap-1.5">
          <Shield size={12} className="text-success" /> {records.length} encrypted record{records.length !== 1 ? 's' : ''} shared
        </p>
      </motion.div>

      {records.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-3xl bg-primary-tint text-primary flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={28} />
          </div>
          <h3 className="text-lg font-bold text-txt-primary">No shared records</h3>
          <p className="text-sm text-txt-secondary mt-2">This patient hasn't shared any records yet.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {records.map((rec, i) => (
            <motion.div key={rec.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="card !p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow duration-500">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-txt-primary truncate">{rec.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  {rec.category && <span className="badge badge-gray text-[10px]">{rec.category}</span>}
                  {rec.shared_at && <span className="text-[10px] text-txt-tertiary">{new Date(rec.shared_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleDownload(rec)}
                disabled={downloading === rec.id}
                className="w-10 h-10 rounded-xl bg-primary-tint text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 flex-shrink-0">
                {downloading === rec.id ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
