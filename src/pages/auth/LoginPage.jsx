import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../components/Toast'
import { Mail, Lock, LogIn, Shield, Heart, Activity, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const { signIn, googleSignIn } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) { toast.error('Fill in all fields'); return }
    setLoading(true)
    try {
      await signIn({ email, password })
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle(response) {
    try {
      const data = await googleSignIn(response.credential)
      if (data.needsRoleSelection) {
        toast.info('Please complete signup to choose your role')
        window.location.href = '/signup?google=1'
        return
      }
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — parallax hero */}
      <div className="relative lg:w-[55%] bg-gradient-to-br from-primary via-primary-dark to-primary-darker overflow-hidden min-h-[300px] lg:min-h-screen flex items-center justify-center">
        {/* Parallax orbs */}
        <motion.div className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.04] -top-32 -left-32"
          animate={{ y: [0, 40, 0], x: [0, 20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-[250px] h-[250px] rounded-full bg-white/[0.05] bottom-10 right-20"
          animate={{ y: [0, -30, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-[150px] h-[150px] rounded-full bg-white/[0.03] top-1/3 right-1/4"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.06] top-20 right-16 hidden lg:block"
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-14 h-14 rounded-full bg-white/[0.05] bottom-32 left-20 hidden lg:block"
          animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }} className="relative z-10 text-center px-8 py-16 max-w-md">
          <img src="/logo.png" alt="MediChain" className="h-14 mx-auto mb-8 brightness-0 invert" />
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Secure Medical Records at Your Fingertips
          </h1>
          <p className="text-white/60 mt-4 text-base leading-relaxed">
            Encrypted with AES-256. Stored on IPFS. Shared on your terms.
          </p>

          <div className="mt-10 flex justify-center gap-5">
            {[
              { icon: Shield, label: 'Encrypted' },
              { icon: Heart, label: 'Trusted' },
              { icon: Activity, label: 'Real-time' },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.12 }}
                className="flex flex-col items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.08] backdrop-blur-sm border border-white/[0.06] flex items-center justify-center shadow-inner-glow">
                  <Icon size={20} className="text-white/80" />
                </div>
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wide">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="lg:w-[45%] flex items-center justify-center p-6 lg:p-12 bg-white">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }} className="w-full max-w-sm">
          <div className="lg:hidden mb-6">
            <img src="/logo.png" alt="MediChain" className="h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-txt-primary">Welcome back</h2>
          <p className="text-txt-secondary mt-2 mb-8">Sign in to access your records</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Email</label>
              <div className="mt-1.5 relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                <input type="email" className="input pl-11" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label-text">Password</label>
              <div className="mt-1.5 relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-txt-tertiary" />
                <input type="password" className="input pl-11" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              className="btn-primary w-full text-base py-3.5" whileTap={{ scale: 0.97 }}>
              {loading
                ? <div className="spinner-sm border-2 border-white/30 border-t-white rounded-full w-5 h-5 animate-spin" />
                : <><LogIn size={18} /> Sign In</>}
            </motion.button>
          </form>

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
              text="continue_with"
              size="large"
              width="100%"
            />
          </div>

          <p className="text-center text-sm text-txt-secondary mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up <ArrowRight size={12} className="inline" /></Link>
          </p>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-[11px] text-txt-tertiary">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
