import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { ArrowLeft } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect the following categories of information:\n\n• Account Information: Name, email address, role (patient/doctor), authentication tokens\n• Profile Information: For doctors — specialization, hospital, education, experience, location, languages\n• Medical Records: Files you upload (encrypted before storage), including titles, categories, and metadata\n• Usage Data: Log data, device information, IP address, browser type, pages visited\n• Communication Data: Appointment notes, connection requests\n\nWe do NOT collect: Biometric data, financial information (no payments processed), social security numbers, or genetic data.`,
    },
    {
      title: '2. How We Use Your Information',
      content: `Your information is used solely to:\n\n• Provide and maintain the Service\n• Encrypt and securely store your medical records\n• Facilitate record sharing between patients and doctors\n• Send transactional emails (appointment confirmations via Resend)\n• Authenticate your identity (via email/password or Google OAuth)\n• Improve the Service through anonymized analytics\n\nWe NEVER use your medical records for advertising, profiling, or any purpose beyond providing the Service.`,
    },
    {
      title: '3. Data Encryption & Security',
      content: `We implement industry-leading security measures:\n\n• AES-256-CBC Encryption: All medical records are encrypted server-side before storage\n• IPFS Storage: Encrypted files are pinned to IPFS via Pinata for decentralized, tamper-resistant storage\n• TLS/SSL: All data in transit is encrypted using HTTPS\n• Token-Based Authentication: JWT tokens with secure refresh mechanisms\n• Access Controls: Role-based permissions ensure only authorized users access data\n• Selective Sharing: Granular per-record, per-doctor sharing with revocation`,
    },
    {
      title: '4. Data Sharing & Third Parties',
      content: `We share data only in these circumstances:\n\n• With Doctors You Authorize: Only records you explicitly share, only while your authorization is active\n• Service Providers: Google (OAuth), Pinata (IPFS storage), Resend (email delivery) — bound by their privacy policies and data processing agreements\n• Legal Requirements: If required by law, regulation, or valid legal process\n\nWe NEVER sell, rent, or trade your personal or medical data.`,
    },
    {
      title: '5. Your Rights',
      content: `You have the right to:\n\n• Access: View all personal data we hold about you\n• Correction: Update inaccurate or incomplete information\n• Deletion: Request deletion of your account and associated data\n• Portability: Download your records in their original format\n• Revocation: Revoke any previously granted data sharing permissions\n• Restriction: Limit how we process your information\n\nTo exercise these rights, contact privacy@medichain.health.`,
    },
    {
      title: '6. Data Retention',
      content: `• Active Accounts: Data is retained as long as your account is active\n• Deleted Accounts: Personal data is deleted within 30 days of account deletion\n• Encrypted Records: Removed from IPFS pins within 30 days (cached copies on IPFS may persist until garbage collected by the network)\n• Anonymized Analytics: May be retained indefinitely in aggregate, non-identifiable form\n• Legal Hold: Data may be retained longer if required by applicable law`,
    },
    {
      title: '7. Children\'s Privacy',
      content: `MediChain is not intended for use by individuals under 18 years of age. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us immediately at privacy@medichain.health and we will delete it.`,
    },
    {
      title: '8. Cookie Policy',
      content: `MediChain uses minimal cookies and local storage:\n\n• Authentication Tokens: Stored in localStorage for session management\n• No Tracking Cookies: We do not use advertising or analytics tracking cookies\n• No Third-Party Trackers: No analytics scripts, pixel trackers, or social media widgets are embedded`,
    },
    {
      title: '9. Changes to This Policy',
      content: `We may update this Privacy Policy periodically. Material changes will be communicated via email notification to registered users at least 14 days before taking effect. The "Last updated" date at the top reflects the most recent revision.`,
    },
    {
      title: '10. Contact Us',
      content: `Data Protection Officer\nMediChain Technologies Pvt. Ltd.\nMumbai, Maharashtra, India\n\nPrivacy inquiries: privacy@medichain.health\nGeneral support: support@medichain.health`,
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to="/" className="btn-ghost !px-3"><ArrowLeft size={18} /></Link>
          <img src="/logo.png" alt="MediChain" className="h-7" />
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="section-heading text-primary">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-txt-primary mt-3">Privacy Policy</h1>
          <p className="text-txt-secondary mt-3">Last updated: October 2026</p>
        </motion.div>

        <div className="mt-12 space-y-10">
          {sections.map(({ title, content }) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
              <h2 className="text-xl font-bold text-txt-primary mb-3">{title}</h2>
              <div className="text-sm text-txt-secondary leading-relaxed whitespace-pre-line">{content}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
