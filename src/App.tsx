import { Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import AppShell from './components/layout/AppShell'
import { useAuth } from './context/AuthContext'
import type { Role } from './types'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import StudentDashboard from './pages/StudentDashboard'
import ReportIssue from './pages/ReportIssue'
import AllIssues from './pages/AllIssues'
import IssueDetails from './pages/IssueDetails'
import MyReports from './pages/MyReports'
import CampusMap from './pages/CampusMap'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import AdminIssues from './pages/AdminIssues'
import Analytics from './pages/Analytics'
import AdminUsers from './pages/AdminUsers'
import AdminDepartments from './pages/AdminDepartments'
import AdminSettings from './pages/AdminSettings'
import NotFound from './pages/NotFound'

function Guard({ role, children }: { role: Role; children: ReactElement }) {
  const { signedIn, role: current } = useAuth()
  if (!signedIn) return <Navigate to="/signin" replace />
  if (current !== role) return <Navigate to={current === 'admin' ? '/admin' : '/app'} replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />

      <Route path="/app" element={<Guard role="student"><AppShell role="student" /></Guard>}>
        <Route index element={<StudentDashboard />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="issues" element={<AllIssues />} />
        <Route path="issues/:id" element={<IssueDetails />} />
        <Route path="map" element={<CampusMap />} />
        <Route path="my-reports" element={<MyReports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/admin" element={<Guard role="admin"><AppShell role="admin" /></Guard>}>
        <Route index element={<AdminDashboard />} />
        <Route path="issues" element={<AdminIssues />} />
        <Route path="issues/:id" element={<IssueDetails />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="map" element={<CampusMap />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
