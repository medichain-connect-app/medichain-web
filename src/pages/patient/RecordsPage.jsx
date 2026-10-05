import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { listMyRecords, downloadRecord, deleteRecord } from '../../services/recordsService'
import { useToast } from '../../components/Toast'
import { RECORD_CATEGORIES } from '../../data/constants'
import { FileText, Download, Trash2, Upload, File, Image, FileSpreadsheet, Filter, Loader, Shield } from 'lucide-react'

function fileIcon(mime) {
  if (!mime) return File
  if (mime.startsWith('image/')) return Image
  if (mime.includes('pdf')) return FileText
  if (mime.includes('spreadsheet') || mime.includes('csv')) return FileSpreadsheet
  return File
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function RecordsPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)
  const [filter, setFilter] = useState('All')
  const toast = useToast()

  useEffect(() => {
    listMyRecords().then(setRecords).catch(() => toast.error('Failed to load records')).finally(() => setLoading(false))
  }, [])

  async function handleDownload(record) {
    setDownloading(record.id)
    try {
      const blob = await downloadRecord(record.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = record.title || record.filename; a.click()
      URL.revokeObjectURL(url)
      toast.success('Downloaded!')
    } catch {
      toast.error('Download failed')
    } finally {
      setDownloading(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this record? This cannot be undone.')) return
    try {
      await deleteRecord(id)
      setRecords(prev => prev.filter(r => r.id !== id))
      toast.success('Record deleted')
    } catch { toast.error('Failed to delete') }
  }

  const filtered = filter === 'All' ? records : records.filter(r => r.category === filter)
  const categories = ['All', ...RECORD_CATEGORIES]

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="spinner" /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-txt-primary">Medical Records</h1>
          <p className="text-sm text-txt-secondary mt-1 flex items-center gap-1.5">
            <Shield size={12} className="text-success" /> {records.length} encrypted record{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/patient/upload" className="btn-primary text-sm">
          <Upload size={16} /> Upload
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`tab flex-shrink-0 text-xs ${filter === cat ? 'active' : ''}`}>
            {cat === 'All' && <Filter size={12} />} {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-16 h-16 rounded-3xl bg-primary-tint text-primary flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-lg font-bold text-txt-primary">No records found</h3>
          <p className="text-sm text-txt-secondary mt-2">Upload your first medical record to get started.</p>
          <Link to="/patient/upload" className="btn-primary mt-6 inline-flex"><Upload size={16} /> Upload Record</Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((record, i) => {
              const Icon = fileIcon(record.mime_type)
              return (
                <motion.div key={record.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
                  exit={{ opacity: 0, x: -50 }}
                  className="card flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-tint text-primary flex items-center justify-center flex-shrink-0">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-txt-primary truncate">{record.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {record.category && <span className="badge badge-gray text-[10px]">{record.category}</span>}
                      {record.file_size_bytes && <span className="text-[11px] text-txt-tertiary">{formatSize(record.file_size_bytes)}</span>}
                      {record.created_at && <span className="text-[11px] text-txt-tertiary">{new Date(record.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDownload(record)}
                      disabled={downloading === record.id}
                      className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                      {downloading === record.id ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDelete(record.id)}
                      className="w-9 h-9 rounded-xl bg-red-50 text-accent-red flex items-center justify-center hover:bg-red-100 transition-all duration-300">
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
