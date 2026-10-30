
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home'
import ReportIssue from './Pages/ReportIssue'
import PublicIssues from './Pages/PublicIssues'
import AdminDashboard from './Pages/AdminDashboard'
import StaffDashboard from './Pages/StaffDashboard'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ViewIssue from './Pages/ViewIssue'
import EditIssue from './Pages/EditIssue'
import ManageStaff from './Pages/ManageStaff'
import Feedback from './Pages/Feedback'
import Landing from './Pages/Landing'

function DashboardLayout() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fb' }}>
            <Sidebar />

            <div style={{ flex: 1, minWidth: 0 }}>
                <Header />

                <main className="p-4">
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/report" element={<ReportIssue />} />
                        <Route path="/issues" element={<PublicIssues />} />
                        <Route path="/issues/:id" element={<ViewIssue />} />
                        <Route path="/edit-issue/:id" element={<EditIssue />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/manage-staff" element={<ManageStaff />} />
                        <Route path="/staff" element={<StaffDashboard />} />
                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    )
}

function App() {
    const location = useLocation()
    const isAuthPage = ['/login', '/register'].includes(location.pathname)

    if (isAuthPage) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        )
    }

    return (
        <Routes>
            {/* Public landing page: only its own navbar */}
            <Route path="/" element={<Landing />} />

            {/* All dashboard pages retain the existing layout */}
            <Route path="/*" element={<DashboardLayout />} />
        </Routes>
    )
}

export default App
