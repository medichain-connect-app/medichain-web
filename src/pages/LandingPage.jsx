import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Footer from '../components/Footer'
import {
  Shield, Lock, Share2, Upload, Zap, ArrowRight,
  CheckCircle, Globe, Heart, Activity, Eye, Smartphone
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }),
}

// Flat line with three heartbeat spikes, drawn on a 1440x200 canvas
const ECG_PATH = [
  'M0 100 H300',
  'l20 -8 l15 8 h25 l12 18 l18 -95 l18 125 l14 -48 h30 l25 -12 l20 12',
  'H780',
  'l20 -8 l15 8 h25 l12 18 l18 -95 l18 125 l14 -48 h30 l25 -12 l20 12',
  'H1260 l12 -6 l12 6 H1440',
].join(' ')

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -60])
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, 120])

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="MediChain" className="h-8" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-txt-secondary hover:text-primary transition px-4 py-2">Log In</Link>
            <Link to="/signup" className="btn-primary !py-2.5 !px-5 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-mesh pt-16">
        {/* Grid pattern, faded out toward the edges */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(36,107,253,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(36,107,253,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_45%,#000_20%,transparent_100%)]" />

        {/* Drifting aurora blobs (parallax on scroll) */}
        <motion.div style={{ y: orb1Y }} className="absolute -top-32 left-[8%] w-[520px] h-[520px]">
          <motion.div animate={{ x: [0, 60, -20, 0], y: [0, 40, 70, 0], scale: [1, 1.12, 0.95, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full rounded-full bg-primary/[0.16] blur-[110px]" />
        </motion.div>
        <motion.div style={{ y: orb2Y }} className="absolute top-[18%] right-[4%] w-[480px] h-[480px]">
          <motion.div animate={{ x: [0, -70, 10, 0], y: [0, 50, -30, 0], scale: [1, 0.92, 1.1, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full rounded-full bg-accent-violet/[0.14] blur-[110px]" />
        </motion.div>
        <motion.div style={{ y: orb3Y }} className="absolute bottom-[-8%] left-[35%] w-[420px] h-[420px]">
          <motion.div animate={{ x: [0, 50, -50, 0], y: [0, -30, 10, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full rounded-full bg-accent-emerald/[0.10] blur-[100px]" />
        </motion.div>

        {/* Heartbeat line running across the hero */}
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true"
          className="absolute left-0 right-0 bottom-[3%] w-full h-[130px] [mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
          <defs>
            <linearGradient id="ecg-glow" x1="0" x2="1">
              <stop offset="0%" stopColor="#246BFD" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <motion.path d={ECG_PATH} fill="none" stroke="#246BFD" strokeOpacity="0.12" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
          <motion.path d={ECG_PATH} fill="none" stroke="url(#ecg-glow)" strokeWidth="2.5" strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(36,107,253,0.6))' }}
            initial={{ pathLength: 0.12, pathOffset: 0, opacity: 0 }}
            animate={{ pathOffset: [0, 1], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 0.8, ease: 'linear', delay: 2.4 }} />
        </svg>

        {/* Fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20">
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
            className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-primary/15 shadow-sm text-primary text-xs font-semibold mb-8">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-success" />
            </span>
            <Shield size={12} /> End-to-End Encrypted Health Records
            <motion.span aria-hidden="true" initial={{ x: '-120%' }} animate={{ x: '320%' }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut', delay: 1 }}
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg]" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-txt-primary leading-[1.1] tracking-tight text-balance">
            {['Your', 'Health', 'Data,'].map((word, i) => (
              <motion.span key={word} className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}>
                {word}
              </motion.span>
            ))}
            <motion.span className="inline-block gradient-text"
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}>
              Secured Forever
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-6 text-lg sm:text-xl text-txt-secondary max-w-2xl mx-auto leading-relaxed text-balance">
            MediChain encrypts your medical records with military-grade AES-256 encryption and stores them on decentralized IPFS. Share securely with doctors — on your terms.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary !px-8 !py-4 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-outline !px-8 !py-4 text-base">
              Sign In
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="mt-12 flex items-center justify-center gap-8 text-txt-tertiary text-sm">
            {['No credit card', 'HIPAA Ready', 'Free for patients'].map((t, i) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-success" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Trust bar */}
      <section className="py-8 border-y border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-txt-tertiary text-sm font-medium">
          {['AES-256-CBC Encryption', 'IPFS Decentralized Storage', 'Google OAuth', 'Zero-Knowledge Proof Ready'].map(t => (
            <span key={t} className="flex items-center gap-2"><Lock size={13} /> {t}</span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-surface border-b border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <span className="section-heading text-primary">How It Works</span>
            <h2 className="text-3xl sm:text-[2.6rem] leading-[1.12] font-extrabold tracking-[-0.025em] text-txt-primary mt-3 max-w-2xl mx-auto text-balance">
              From paper file to private, shareable record in a minute
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-[repeating-linear-gradient(to_right,#CBD5E1_0_6px,transparent_6px_12px)]" />
            {[
              { icon: Upload, title: 'Upload a record', desc: 'Add a prescription, lab report or scan from your phone or computer.' },
              { icon: Lock, title: 'It gets encrypted', desc: 'The file is encrypted with AES-256 and stored on IPFS, so it can’t be read or quietly altered.' },
              { icon: Share2, title: 'Share it, or don’t', desc: 'Pick the exact records a doctor can see. Change your mind later and revoke access instantly.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative text-center px-4">
                <div className="relative mx-auto w-16 h-16 rounded-2xl bg-white border border-border shadow-card flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-surface">{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-txt-primary">{title}</h3>
                <p className="mt-2 text-sm text-txt-secondary leading-relaxed max-w-xs mx-auto">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16">
            <span className="section-heading text-primary">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-txt-primary mt-3 text-balance">
              Everything you need for secure health records
            </h2>
            <p className="text-txt-secondary mt-4 max-w-xl mx-auto text-balance">
              Built with privacy-first architecture. No compromises on security or user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: 'End-to-End Encryption', desc: 'Military-grade AES-256-CBC encryption for every file. Your data is encrypted before it leaves your device.', color: 'from-primary to-primary-dark' },
              { icon: Globe, title: 'IPFS Storage', desc: 'Decentralized storage via IPFS ensures your records are always available and tamper-proof.', color: 'from-accent-violet to-purple-700' },
              { icon: Share2, title: 'Selective Sharing', desc: 'Share specific records with specific doctors. Revoke access anytime with one tap.', color: 'from-accent-emerald to-emerald-700' },
              { icon: Eye, title: 'Full Transparency', desc: 'See exactly who has access to your records and when they were last viewed.', color: 'from-accent-cyan to-cyan-700' },
              { icon: Smartphone, title: 'Mobile Responsive', desc: 'Access your records from any device — phone, tablet, or desktop. Always in sync.', color: 'from-accent-rose to-rose-700' },
              { icon: Zap, title: 'Instant Access', desc: 'No waiting. Records load instantly with optimized delivery and edge caching.', color: 'from-amber-500 to-orange-600' },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
                className="group card !p-7 hover:!-translate-y-1 transition-all duration-500">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-txt-primary">{title}</h3>
                <p className="text-sm text-txt-secondary mt-2 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary via-primary-dark to-primary-darker relative overflow-hidden">
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-80 h-80 rounded-full bg-white/[0.03] -top-20 -left-20" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute w-60 h-60 rounded-full bg-white/[0.03] bottom-0 right-10" />

        <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '256-bit', label: 'Encryption' },
            { value: 'IPFS', label: 'Storage' },
            { value: '99.9%', label: 'Uptime' },
            { value: '0', label: 'Data Breaches' },
          ].map(({ value, label }, i) => (
            <motion.div key={label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="text-4xl font-extrabold text-white">{value}</div>
              <div className="text-sm text-white/50 font-medium mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* For patients & doctors */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            {
              badge: 'For Patients', title: 'Own Your Health Data',
              points: ['Upload and encrypt medical records', 'Find verified doctors by specialty', 'Share records with one tap', 'Book appointments online', 'Revoke access anytime'],
              gradient: 'from-primary to-primary-dark', icon: Heart, cta: 'Sign Up as Patient', ctaLink: '/signup',
            },
            {
              badge: 'For Doctors', title: 'Serve Patients Better',
              points: ['Receive encrypted patient records', 'Manage appointment requests', 'Build your professional profile', 'Connect with patients securely', 'Access records from any device'],
              gradient: 'from-accent-emerald to-emerald-700', icon: Activity, cta: 'Sign Up as Doctor', ctaLink: '/signup',
            },
          ].map(({ badge, title, points, gradient, icon: Icon, cta, ctaLink }, idx) => (
            <motion.div key={badge} custom={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="card !p-8 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />
              <span className={`inline-block text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-3`}>{badge}</span>
              <h3 className="text-2xl font-extrabold text-txt-primary">{title}</h3>
              <ul className="mt-5 space-y-3">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-3 text-sm text-txt-secondary">
                    <CheckCircle size={16} className="text-success flex-shrink-0 mt-0.5" /> {p}
                  </li>
                ))}
              </ul>
              <Link to={ctaLink} className="btn-primary mt-6 text-sm">{cta} <ArrowRight size={16} /></Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-surface">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-txt-primary text-balance">
            Ready to take control of your health records?
          </h2>
          <p className="text-txt-secondary mt-4 text-lg">Join thousands of patients and doctors already on MediChain.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary !px-8 !py-4 text-base shadow-lg shadow-primary/25">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/terms" className="text-sm font-semibold text-txt-secondary hover:text-primary transition">
              Read Terms of Service
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
