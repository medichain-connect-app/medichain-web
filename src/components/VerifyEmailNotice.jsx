import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MailCheck, RefreshCw, ArrowLeft } from 'lucide-react'
import { resendVerification } from '../services/authService'

const COOLDOWN_SECONDS = 60

export function ResendVerificationButton({ email, className = '' }) {
  const [sending, setSending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [cooldown])

  async function handleResend() {
    setSending(true)
    setStatus(null)
    try {
      await resendVerification(email)
      setStatus({ ok: true, text: 'A new link is on its way.' })
      setCooldown(COOLDOWN_SECONDS)
    } catch (err) {
      setStatus({ ok: false, text: err.message || 'Could not resend the email. Try again shortly.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={className}>
      <button type="button" onClick={handleResend} disabled={sending || cooldown > 0}
        className="btn-secondary w-full text-sm disabled:opacity-60 disabled:cursor-not-allowed">
        <RefreshCw size={15} className={sending ? 'animate-spin' : ''} />
        {cooldown > 0 ? `Resend available in ${cooldown}s` : sending ? 'Sending…' : 'Resend verification email'}
      </button>
      {status && (
        <p className={`mt-2 text-center text-xs font-medium ${status.ok ? 'text-emerald-600' : 'text-accent-red'}`}>{status.text}</p>
      )}
    </div>
  )
}

export default function VerifyEmailNotice({ email, onBack }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="w-16 h-16 rounded-2xl bg-primary-tint flex items-center justify-center">
        <MailCheck size={30} className="text-primary" />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-txt-primary">Confirm your email</h2>
      <p className="text-txt-secondary mt-3 leading-relaxed">
        We sent a confirmation link to <span className="font-semibold text-txt-primary break-all">{email}</span>.
        Click the link to activate your account. You can sign in once it's confirmed.
      </p>

      <ResendVerificationButton email={email} className="mt-6" />

      <button type="button" onClick={onBack}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-txt-secondary hover:text-primary transition">
        <ArrowLeft size={15} /> Wrong email? Go back
      </button>
    </motion.div>
  )
}
