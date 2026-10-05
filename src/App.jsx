import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

import LandingPage from './pages/LandingPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import PatientDashboard from './pages/patient/PatientDashboard'
import RecordsPage from './pages/patient/RecordsPage'
import UploadPage from './pages/patient/UploadPage'
import FindDoctorsPage from './pages/patient/FindDoctorsPage'
import DoctorProfileView from './pages/patient/DoctorProfileView'
import BookAppointment from './pages/patient/BookAppointment'
import SendRecordsPage from './pages/patient/SendRecordsPage'
import ProfilePage from './pages/patient/ProfilePage'
import EditProfilePage from './pages/patient/EditProfilePage'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorProfileEdit from './pages/doctor/DoctorProfileEdit'
import PatientRecordsPage from './pages/doctor/PatientRecordsPage'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="MediChain" className="h-10 animate-pulse" />
          <div className="spinner" />
        </div>
      </div>
    )
  }

  const isPublicPage = ['/', '/terms', '/privacy', '/contact'].includes(location.pathname)
  const isAuthPage = ['/login', '/signup'].includes(location.pathname) || location.pathname.startsWith('/signup')

  return (
    <>
      {!isPublicPage && !isAuthPage && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={user ? <Navigate to={homeFor(user.role)} replace /> : <LandingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/login" element={user ? <Navigate to={homeFor(user.role)} replace /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to={homeFor(user.role)} replace /> : <SignupPage />} />

          <Route path="/patient/dashboard" element={<PrivateRoute roles={['patient']}><PatientDashboard /></PrivateRoute>} />
          <Route path="/patient/records" element={<PrivateRoute roles={['patient']}><RecordsPage /></PrivateRoute>} />
          <Route path="/patient/upload" element={<PrivateRoute roles={['patient']}><UploadPage /></PrivateRoute>} />
          <Route path="/patient/find-doctors" element={<PrivateRoute roles={['patient']}><FindDoctorsPage /></PrivateRoute>} />
          <Route path="/patient/doctor/:doctorId" element={<PrivateRoute roles={['patient']}><DoctorProfileView /></PrivateRoute>} />
          <Route path="/patient/book-appointment/:doctorId" element={<PrivateRoute roles={['patient']}><BookAppointment /></PrivateRoute>} />
          <Route path="/patient/send-records/:doctorId" element={<PrivateRoute roles={['patient']}><SendRecordsPage /></PrivateRoute>} />
          <Route path="/patient/profile" element={<PrivateRoute roles={['patient']}><ProfilePage /></PrivateRoute>} />
          <Route path="/patient/edit-profile" element={<PrivateRoute roles={['patient']}><EditProfilePage /></PrivateRoute>} />

          <Route path="/doctor/dashboard" element={<PrivateRoute roles={['doctor']}><DoctorDashboard /></PrivateRoute>} />
          <Route path="/doctor/profile-edit" element={<PrivateRoute roles={['doctor']}><DoctorProfileEdit /></PrivateRoute>} />
          <Route path="/doctor/patient-records/:patientId" element={<PrivateRoute roles={['doctor']}><PatientRecordsPage /></PrivateRoute>} />

          <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />

          <Route path="*" element={<Navigate to={user ? homeFor(user.role) : '/'} replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function homeFor(role) {
  if (role === 'doctor') return '/doctor/dashboard'
  if (role === 'admin') return '/admin/dashboard'
  return '/patient/dashboard'
}
