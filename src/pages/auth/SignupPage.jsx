import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'
import { Mail, Lock, User, UserPlus, Stethoscope, Heart, Shield, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const { signUp, googleSignIn, completeGoogleProfile } = useAuth()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const isGoogleFlow = searchParams.get('google') === '1'

  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: '' })
  const [loading, setLoading] = useState(false)

  function set(field) {
    return (e) => setForm(prev => ({ ...prev, [field]: typeof e === 'string' ? e : e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.role) { toast.error('Please select a role'); return }

    if (isGoogleFlow) {
      setLoading(true)
      try {
        await completeGoogleProfile(form.role)
        toast.success('Account setup complete!')
      } catch (err) {
        toast.error(err.message || 'Failed to complete profile')
      } finally {
        setLoading(false)
      }
      return
    }

    if (!form.fullName || !form.email || !form.password) { toast.error('Fill in all fields'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      const data = await signUp({ email: form.email, password: form.password, fullName: form.fullName, role: form.role })
      if (data.needsEmailConfirmation) {
        toast.info('Check your email to verify your account')
      } else {
        toast.success('Account created!')
      }
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle(response) {
    try {
      const data = await googleSignIn(response.credential)
      if (data.needsRoleSelection) {
        toast.info('Choose your role to continue')
        window.history.replaceState({}, '', '/signup?google=1')
      } else {
        toast.success('Welcome!')
      }
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    }
  }

  const roles = [
    { value: 'patient', label: 'Patient', desc: 'Store & share medical records securely', icon: Heart, gradient: 'from-accent-emerald to-emerald-600', tint: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { value: 'doctor', label: 'Doctor', desc: 'Access patient records & manage appointments', icon: Stethoscope, gradient: 'from-primary to-primary-dark', tint: 'bg-primary-tint border-primary/20 text-primary' },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left hero */}
      <div className="relative lg:w-[55%] bg-gradient-to-br from-accent-emerald via-emerald-600 to-teal-700 overflow-hidden min-h-[260px] lg:min-h-screen flex items-center justify-center">
        <motion.div className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.04] -bottom-32 -right-32"
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-[250px] h-[250px] rounded-full bg-white/[0.05] top-20 left-10"
          animate={{ y: [0, 25, 0], x: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.06] bottom-20 left-16 hidden lg:block"
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }} className="relative z-10 text-center px-8 py-16 max-w-md">
          <img src="/logo.png" alt="MediChain" className="h-14 mx-auto mb-8 brightness-0 invert" />
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Join the Future of Health Records
          </h1>
          <p className="text-white/60 mt-4 text-base leading-relaxed">
            Your health data, encrypted and secure. Own your medical journey.
          </p>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-8 bg-white/[0.07] backdrop-blur-xl rounded-2xl p-5 max-w-xs mx-auto border border-white/[0.08]">
            <Shield size={22} className="text-white mx-auto mb-2" />
            <p className="text-sm text-white/80 font-medium">All records encrypted with AES-256-CBC and stored on decentralized IPFS</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="lg:w-[45%] flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }} className="w-full max-w-sm">
          <div className="lg:hidden mb-6">
            <img src="/logo.png" alt="MediChain" className="h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-txt-primary">
            {isGoogleFlow ? 'Complete Setup' : 'Create Account'}
          </h2>
          <p className="text-txt-secondary mt-2 mb-6">
            {isGoogleFlow ? 'Choose your role to get started' : 'Join thousands on MediChain'}
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {roles.map(r => (
              <motion.button key={r.value} type="button" whileTap={{ scale: 0.97 }}
                onClick={() => set('role')(r.value)}
                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-400 ${
                  form.role === r.value
                    ? 'border-primary bg-primary-tint shadow-glow'
                    : 'border-border hover:border-primary/30 hover:bg-surface'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                  <r.icon size={20} className="text-white" />
                </div>
                <div className="font-bold text-sm text-txt-primary">{r.label}</div>
                <div className="text-[11px] text-txt-secondary mt-0.5 leading-snug">{r.desc}</div>
                {form.role === r.value && (
                  <motion.div layoutId="role-check"
                    className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isGoogleFlow && (
              <>
                <div>
                  <label className="label-text">Full Name</label>
                  <div className="mt-1.5 relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                    <input className="input pl-11" placeholder="John Doe" value={form.fullName} onChange={set('fullName')} />
                  </div>
                </div>
                <div>
                  <label className="label-text">Email</label>
                  <div className="mt-1.5 relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                    <input type="email" className="input pl-11" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>
                <div>
                  <label className="label-text">Password</label>
                  <div className="mt-1.5 relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                    <input type="password" className="input pl-11" placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
                  </div>
                </div>
              </>
            )}

            <motion.button type="submit" disabled={loading}
              className="btn-primary w-full text-base py-3.5" whileTap={{ scale: 0.97 }}>
              {loading
                ? <div className="spinner-sm border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin" />
                : <><UserPlus size={18} /> {isGoogleFlow ? 'Continue' : 'Create Account'}</>}
            </motion.button>
          </form>

          {!isGoogleFlow && (
            <>
              <div className="my-7 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs font-semibold text-txt-tertiary uppercase tracking-wide">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogle}
                  onError={() => toast.error('Google sign-in failed')}
                  shape="pill"
                  text="signup_with"
                  size="large"
                />
              </div>
              <p className="text-center text-sm text-txt-secondary mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">Sign in <ArrowRight size={12} className="inline" /></Link>
              </p>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-[11px] text-txt-tertiary">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
