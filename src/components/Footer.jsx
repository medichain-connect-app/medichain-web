import { Link } from 'react-router-dom'
import { Shield, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-txt-primary text-white mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="MediChain" className="h-8 brightness-0 invert" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Secure, encrypted medical records platform. Your health data belongs to you — share it on your terms.
            </p>
            <div className="flex items-center gap-2 mt-4 text-white/30 text-xs">
              <Shield size={12} /> AES-256-CBC Encrypted
              <span className="mx-1">|</span>
              <Heart size={12} /> IPFS Decentralized Storage
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {['Features', 'Security', 'For Patients', 'For Doctors'].map(item => (
                <li key={item}>
                  <span className="text-sm text-white/60 hover:text-white transition cursor-default">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/terms" className="text-sm text-white/60 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-white/60 hover:text-white transition">Privacy Policy</Link></li>
              <li><span className="text-sm text-white/60 cursor-default">HIPAA Compliance</span></li>
              <li><Link to="/contact" className="text-sm text-white/60 hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} MediChain Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
