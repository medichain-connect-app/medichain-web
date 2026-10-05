import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { ArrowLeft } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using the MediChain platform ("Service"), operated by MediChain Technologies Pvt. Ltd. ("Company", "we", "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Service. These Terms apply to all users, including patients, healthcare providers ("Doctors"), and administrators.`,
    },
    {
      title: '2. Description of Service',
      content: `MediChain is a health data management platform that allows patients to upload, encrypt, store, and selectively share medical records with authorized healthcare providers. The Service includes:\n\n• Encrypted medical record storage using AES-256-CBC encryption\n• Decentralized file storage via IPFS (InterPlanetary File System)\n• Doctor discovery and connection management\n• Appointment scheduling and management\n• Selective record sharing with granular access controls\n• Email notifications for appointment confirmations`,
    },
    {
      title: '3. User Accounts & Registration',
      content: `You must register for an account to use the Service. You may register using email/password or Google OAuth. You agree to:\n\n• Provide accurate, current, and complete information during registration\n• Maintain the security of your password and account credentials\n• Promptly update your information if it changes\n• Accept responsibility for all activities under your account\n• Not create accounts for others or share your credentials\n\nWe reserve the right to suspend or terminate accounts that violate these Terms.`,
    },
    {
      title: '4. Medical Disclaimer',
      content: `MediChain is a data management platform, NOT a medical service provider. The Service does not provide medical advice, diagnoses, or treatment. Doctor profiles and information displayed are self-reported by healthcare providers. We do not verify medical credentials, licenses, or qualifications beyond basic profile validation.\n\nAlways seek the advice of qualified healthcare professionals regarding medical conditions. Never disregard professional medical advice or delay seeking it because of information accessed through our platform.`,
    },
    {
      title: '5. Data Privacy & Encryption',
      content: `Your privacy is fundamental to our platform:\n\n• All uploaded medical records are encrypted using AES-256-CBC encryption before storage\n• Encrypted files are stored on IPFS (InterPlanetary File System) for decentralized, tamper-resistant storage\n• Encryption keys are managed server-side and are never exposed to unauthorized parties\n• You maintain full control over who can access your records\n• You may revoke shared access at any time\n• We do not sell, rent, or trade your personal health information to third parties\n\nFor complete details, please refer to our Privacy Policy.`,
    },
    {
      title: '6. User Responsibilities',
      content: `As a user of MediChain, you agree to:\n\n• Use the Service only for lawful purposes\n• Not upload malicious files, viruses, or harmful content\n• Not attempt to breach, circumvent, or test the security of the platform\n• Not impersonate healthcare providers or other users\n• Not use automated tools to scrape, harvest, or collect data from the Service\n• Not interfere with or disrupt the Service or its infrastructure\n• Comply with all applicable local, state, national, and international laws`,
    },
    {
      title: '7. Healthcare Provider Terms',
      content: `Doctors and healthcare providers who register on MediChain additionally agree to:\n\n• Provide accurate professional information including name, specialization, and qualifications\n• Handle all patient data received through the platform in accordance with applicable medical privacy laws\n• Not download, copy, or redistribute patient records beyond the scope of treatment\n• Respond to appointment requests in a timely manner\n• Maintain professional standards of care in all platform interactions`,
    },
    {
      title: '8. Intellectual Property',
      content: `The Service, including its design, features, code, logos ("MediChain", "Health on Chain"), and branding, is owned by MediChain Technologies Pvt. Ltd. and is protected by intellectual property laws.\n\nYou retain ownership of all medical records and content you upload. By uploading content, you grant us a limited license to store, process, encrypt, and transmit your data solely for the purpose of providing the Service.`,
    },
    {
      title: '9. Third-Party Services',
      content: `Our Service integrates with third-party services:\n\n• Google OAuth: For authentication — governed by Google's Terms of Service\n• IPFS / Pinata: For decentralized file storage\n• Resend: For transactional email delivery (appointment confirmations)\n\nWe are not responsible for the availability, accuracy, or practices of third-party services. Your use of third-party services is subject to their respective terms.`,
    },
    {
      title: '10. Service Availability & Modifications',
      content: `We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may:\n\n• Modify, update, or discontinue features with reasonable notice\n• Perform scheduled maintenance during off-peak hours\n• Temporarily suspend the Service for security or compliance reasons\n\nWe will make reasonable efforts to notify users of significant changes.`,
    },
    {
      title: '11. Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:\n\n• The Service is provided "AS IS" without warranties of any kind\n• We are not liable for any indirect, incidental, special, or consequential damages\n• Our total liability shall not exceed the amount paid by you (if any) in the twelve months preceding the claim\n• We are not responsible for data loss due to factors beyond our reasonable control, including IPFS network failures or third-party service outages`,
    },
    {
      title: '12. Indemnification',
      content: `You agree to indemnify and hold harmless MediChain Technologies Pvt. Ltd., its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.`,
    },
    {
      title: '13. Account Termination',
      content: `You may delete your account at any time by contacting support. Upon termination:\n\n• Your encrypted records will be retained for 30 days for recovery purposes, then permanently deleted\n• Shared access to your records will be immediately revoked\n• We may retain anonymized, aggregated data for analytics\n• We may terminate accounts that violate these Terms without prior notice`,
    },
    {
      title: '14. Governing Law & Disputes',
      content: `These Terms are governed by the laws of India. Any disputes arising from or relating to the Service shall be resolved through:\n\n1. Good-faith negotiation between the parties\n2. Mediation administered by a mutually agreed mediator\n3. Binding arbitration in accordance with the Arbitration and Conciliation Act, 1996\n\nThe courts of Mumbai, Maharashtra shall have exclusive jurisdiction.`,
    },
    {
      title: '15. Changes to Terms',
      content: `We may update these Terms from time to time. We will notify registered users of material changes via email or in-app notification at least 14 days before the changes take effect. Continued use of the Service after changes become effective constitutes acceptance of the revised Terms.`,
    },
    {
      title: '16. Contact Information',
      content: `For questions about these Terms, contact us:\n\nMediChain Technologies Pvt. Ltd.\nEmail: legal@medichain.health\nAddress: Mumbai, Maharashtra, India\n\nFor data privacy concerns: privacy@medichain.health\nFor security reports: security@medichain.health`,
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-txt-primary mt-3">Terms of Service</h1>
          <p className="text-txt-secondary mt-3">Last updated: October 2026</p>
        </motion.div>

        <div className="mt-12 space-y-10">
          {sections.map(({ title, content }, i) => (
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
