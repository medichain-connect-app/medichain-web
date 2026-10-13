import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { X, Lock, EyeOff, ShieldAlert, Link2 } from 'lucide-react'
import { viewRecord } from '../services/recordsService'
import { useAuth } from '../contexts/AuthContext'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const BLOCKED_SHORTCUTS = new Set(['s', 'p', 'c', 'a', 'u', 'x'])

/**
 * View-only viewer for a record shared with a doctor.
 *
 * The file is drawn onto canvases (PDFs via pdf.js, never the browser's own
 * PDF viewer with its download/print buttons) and every page carries a
 * watermark naming the viewer and the time. Saving, printing, copying,
 * dragging and the context menu are blocked, and the content is hidden when
 * the window loses focus or Print Screen is pressed.
 *
 * A web page cannot fully prevent screenshots (OS tools, a phone camera), so
 * the watermark makes any copy traceable to the doctor who made it.
 */
export default function SecureRecordViewer({ record, onClose }) {
  const { user } = useAuth()
  const pagesRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | unsupported | error
  const [error, setError] = useState(null)
  const [hidden, setHidden] = useState(false)

  const watermark = `${user?.full_name ? `Dr. ${user.full_name.replace(/^Dr\.?\s*/i, '')}` : user?.email || 'MediChain'} · ${user?.email || ''} · ${new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })} · MediChain confidential`

  // Load, decrypt (server-side) and draw the record.
  useEffect(() => {
    let cancelled = false
    let pdf = null
    const container = pagesRef.current

    ;(async () => {
      try {
        const blob = await viewRecord(record.id)
        const type = (blob.type || record.mime_type || '').toLowerCase()
        const name = (record.filename || record.title || '').toLowerCase()
        const width = Math.min(container.clientWidth || 800, 1000)

        if (type.includes('pdf') || name.endsWith('.pdf')) {
          pdf = await pdfjsLib.getDocument({ data: await blob.arrayBuffer(), isEvalSupported: false }).promise
          for (let n = 1; n <= pdf.numPages && !cancelled; n++) {
            const page = await pdf.getPage(n)
            const base = page.getViewport({ scale: 1 })
            const viewport = page.getViewport({ scale: (width / base.width) * (window.devicePixelRatio || 1) })
            const canvas = makeCanvas(viewport.width, viewport.height, width)
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
            stampWatermark(canvas, watermark)
            container.appendChild(canvas)
          }
        } else if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/.test(name)) {
          const bitmap = await createImageBitmap(blob)
          const scale = Math.min(1, width / bitmap.width) * (window.devicePixelRatio || 1)
          const canvas = makeCanvas(bitmap.width * scale, bitmap.height * scale, Math.min(width, bitmap.width))
          canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
          bitmap.close()
          stampWatermark(canvas, watermark)
          container.appendChild(canvas)
        } else {
          if (!cancelled) setStatus('unsupported')
          return
        }
        if (!cancelled) setStatus('ready')
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not open this record')
          setStatus('error')
        }
      }
    })()

    return () => {
      cancelled = true
      if (pdf) pdf.destroy()
      // Wipe the drawn pages so nothing lingers after closing.
      container?.querySelectorAll('canvas').forEach(c => { c.width = 0; c.height = 0 })
      if (container) container.innerHTML = ''
    }
  }, [record.id])

  // Block save / print / copy shortcuts, Print Screen, and printing.
  useEffect(() => {
    function onKey(e) {
      const key = e.key?.toLowerCase()
      if ((e.ctrlKey || e.metaKey) && BLOCKED_SHORTCUTS.has(key)) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (e.key === 'PrintScreen') {
        setHidden(true)
        navigator.clipboard?.writeText('').catch(() => {})
      }
      if (e.key === 'Escape') onClose()
    }
    const hide = () => setHidden(true)
    const onVisibility = () => { if (document.hidden) setHidden(true) }

    window.addEventListener('keydown', onKey, true)
    window.addEventListener('keyup', onKey, true)
    window.addEventListener('blur', hide)
    window.addEventListener('beforeprint', hide)
    document.addEventListener('visibilitychange', onVisibility)

    const style = document.createElement('style')
    style.textContent = '@media print { body * { visibility: hidden !important; } }'
    document.head.appendChild(style)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey, true)
      window.removeEventListener('keyup', onKey, true)
      window.removeEventListener('blur', hide)
      window.removeEventListener('beforeprint', hide)
      document.removeEventListener('visibilitychange', onVisibility)
      style.remove()
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const block = e => e.preventDefault()

  return (
    <motion.div className="fixed inset-0 z-50 flex flex-col bg-txt-primary/95"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      role="dialog" aria-modal="true" aria-label={`Viewing ${record.title}`}
      onContextMenu={block} onDragStart={block} onCopy={block} onCut={block}>

      <header className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-txt-primary text-white border-b border-white/10">
        <Lock size={16} className="text-emerald-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{record.title}</p>
          <p className="text-[11px] text-white/60">View only · downloading and printing are disabled · this view is recorded on the blockchain</p>
        </div>
        <button onClick={onClose} aria-label="Close viewer"
          className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center flex-shrink-0">
          <X size={18} />
        </button>
      </header>

      <div className="relative flex-1 overflow-y-auto select-none" style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
        <div ref={pagesRef}
          className={`mx-auto max-w-[1000px] px-3 sm:px-6 py-6 flex flex-col items-center gap-4 transition-[filter] duration-150 ${hidden ? 'blur-2xl' : ''}`} />

        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70">
            <div className="spinner" />
            <p className="text-sm">Decrypting securely…</p>
          </div>
        )}
        {(status === 'error' || status === 'unsupported') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
            <ShieldAlert size={36} className="text-amber-400" />
            <p className="font-bold">{status === 'error' ? error : "This file type can't be shown in the secure viewer"}</p>
            {status === 'unsupported' && (
              <p className="text-sm text-white/60 max-w-sm">For security, shared records can only be opened as PDFs or images. Ask the patient to upload it in one of those formats.</p>
            )}
          </div>
        )}

        {hidden && status === 'ready' && (
          <button onClick={() => setHidden(false)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white bg-txt-primary/40">
            <EyeOff size={32} />
            <span className="font-bold">Record hidden</span>
            <span className="text-sm text-white/70">Click to continue viewing</span>
          </button>
        )}
      </div>

      <footer className="px-4 py-2 text-center text-[11px] text-white/50 bg-txt-primary border-t border-white/10 flex items-center justify-center gap-1.5">
        <Link2 size={11} /> Watermarked with your name and the time. Copies can be traced to this view.
      </footer>
    </motion.div>
  )
}

function makeCanvas(pixelWidth, pixelHeight, cssWidth) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(pixelWidth)
  canvas.height = Math.floor(pixelHeight)
  canvas.style.width = `${cssWidth}px`
  canvas.style.maxWidth = '100%'
  canvas.style.height = 'auto'
  canvas.className = 'rounded-lg shadow-2xl bg-white pointer-events-none'
  canvas.setAttribute('aria-hidden', 'true')
  return canvas
}

/** Tile a faint diagonal watermark across the page, baked into the pixels. */
function stampWatermark(canvas, text) {
  const ctx = canvas.getContext('2d')
  const size = Math.max(12, Math.round(canvas.width / 45))
  ctx.save()
  ctx.font = `600 ${size}px "Plus Jakarta Sans", system-ui, sans-serif`
  ctx.fillStyle = 'rgba(15, 23, 42, 0.13)'
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(-Math.PI / 6)
  const step = ctx.measureText(text).width + size * 4
  const diagonal = Math.hypot(canvas.width, canvas.height)
  for (let y = -diagonal; y < diagonal; y += size * 7) {
    const offset = (y / (size * 7)) % 2 ? step / 2 : 0
    for (let x = -diagonal; x < diagonal; x += step) {
      ctx.fillText(text, x + offset, y)
    }
  }
  ctx.restore()
}
