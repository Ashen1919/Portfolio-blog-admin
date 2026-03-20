import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import Posts from './pages/Posts'
import Categories from './pages/Categories'
import Tags from './pages/Tags'
import Users from './pages/Users'
import Login from './pages/Login'

function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* ── Left Sidebar ───────────────────────────────── */}
      <div className="flex-shrink-0 flex flex-col border-r border-[#1e2130] lg:w-[240px] xl:w-[260px]">
        <Sidebar />
      </div>

      {/* ── Right Content Area ─────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/tags" element={<Tags />} />
            <Route path="/users" element={<Users />} />
            {/* Catch-all inside admin */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
