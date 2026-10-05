import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Footer from '../components/Footer'
import {
  Shield, Lock, Share2, FileText, Users, Zap, ArrowRight,
  CheckCircle, Globe, Heart, Activity, Eye, Smartphone
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }),
}

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
        {/* Parallax orbs */}
        <motion.div style={{ y: orb1Y }} className="absolute w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary/[0.07] to-transparent -top-40 -left-40 blur-3xl" />
        <motion.div style={{ y: orb2Y }} className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-accent-violet/[0.06] to-transparent -bottom-60 -right-40 blur-3xl" />
        <motion.div style={{ y: orb3Y }} className="absolute w-[300px] h-[300px] rounded-full bg-gradient-radial from-accent-emerald/[0.06] to-transparent top-1/3 right-1/4 blur-2xl" />

        {/* Floating shapes */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-32 left-[10%] w-16 h-16 rounded-2xl bg-primary/[0.06] border border-primary/[0.08] backdrop-blur-sm hidden lg:block" />
        <motion.div animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-40 right-[12%] w-20 h-20 rounded-3xl bg-accent-violet/[0.06] border border-accent-violet/[0.08] backdrop-blur-sm hidden lg:block" />
        <motion.div animate={{ y: [0, -12, 0], scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 left-[5%] w-12 h-12 rounded-full bg-accent-emerald/[0.08] border border-accent-emerald/[0.1] hidden lg:block" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-tint border border-primary/10 text-primary text-xs font-semibold mb-8">
            <Shield size={12} /> End-to-End Encrypted Health Records
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-txt-primary leading-[1.1] tracking-tight text-balance">
            Your Health Data,{' '}
            <span className="gradient-text">Secured Forever</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-lg sm:text-xl text-txt-secondary max-w-2xl mx-auto leading-relaxed text-balance">
            MediChain encrypts your medical records with military-grade AES-256 encryption and stores them on decentralized IPFS. Share securely with doctors — on your terms.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary !px-8 !py-4 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-outline !px-8 !py-4 text-base">
              Sign In
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
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

      {/* How it works */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <span className="section-heading text-primary">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-txt-primary mt-3">Three simple steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Records', desc: 'Upload any medical document — prescriptions, lab reports, imaging. We encrypt it instantly.', icon: FileText },
              { step: '02', title: 'Connect with Doctors', desc: 'Find verified doctors by specialty and location. Send connection requests securely.', icon: Users },
              { step: '03', title: 'Share Selectively', desc: 'Choose exactly which records to share with which doctor. Revoke anytime.', icon: Shield },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div key={step} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="relative text-center">
                <div className="text-7xl font-extrabold text-primary/[0.06] absolute -top-4 left-1/2 -translate-x-1/2 select-none">{step}</div>
                <div className="relative pt-8">
                  <div className="w-16 h-16 rounded-3xl bg-white border border-border shadow-card flex items-center justify-center mx-auto mb-5">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-txt-primary">{title}</h3>
                  <p className="text-sm text-txt-secondary mt-2 leading-relaxed max-w-xs mx-auto">{desc}</p>
                </div>
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
