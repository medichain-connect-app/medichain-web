import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { ArrowLeft, Mail, MapPin, Phone, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/" className="btn-ghost !px-3"><ArrowLeft size={18} /></Link>
          <img src="/logo.png" alt="MediChain" className="h-7" />
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="section-heading text-primary">Get in Touch</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-txt-primary mt-3">Contact Us</h1>
          <p className="text-txt-secondary mt-3 max-w-lg">Have questions about MediChain? We'd love to hear from you.</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Mail, title: 'Email', detail: 'support@medichain.health', sub: 'Response within 24 hours' },
            { icon: MapPin, title: 'Office', detail: 'Mumbai, Maharashtra', sub: 'India' },
            { icon: Phone, title: 'Phone', detail: '+91 (022) XXXX-XXXX', sub: 'Mon-Fri 9AM-6PM IST' },
            { icon: MessageSquare, title: 'Feedback', detail: 'feedback@medichain.health', sub: 'We value your suggestions' },
          ].map(({ icon: Icon, title, detail, sub }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="card !p-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-tint text-primary flex items-center justify-center mb-4">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-txt-primary">{title}</h3>
              <p className="text-sm text-txt-primary mt-1 font-medium">{detail}</p>
              <p className="text-xs text-txt-tertiary mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
