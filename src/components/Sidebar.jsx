import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineTag,
  HiOutlineUsers,
  HiOutlineLogout,
  HiOutlineCollection,
  HiMenuAlt2,
  HiX,
} from 'react-icons/hi'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axiosInstance'

const navItems = [
  { to: '/',            label: 'Dashboard',  icon: HiOutlineViewGrid,     exact: true },
  { to: '/posts',       label: 'Posts',       icon: HiOutlineDocumentText, exact: false },
  { to: '/categories',  label: 'Categories',  icon: HiOutlineCollection,   exact: false },
  { to: '/tags',        label: 'Tags',        icon: HiOutlineTag,          exact: false },
  { to: '/users',       label: 'Users',       icon: HiOutlineUsers,        exact: false },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await axiosInstance.post('/auth/logout')
      toast.success('Goodbye! See you soon 👋')
      navigate('/login')
    } catch {
      toast.error('Logout failed. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <>
      {/* ── Mobile top bar ──────────────────────────────── */}
      <div className="flex items-center justify-between bg-[#0f1117] px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
            <HiOutlineDocumentText className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">BlogAdmin</span>
        </div>
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <HiX className="h-5 w-5" /> : <HiMenuAlt2 className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Sidebar Panel ───────────────────────────────── */}
      <aside
        className={[
          'bg-[#0f1117] flex flex-col transition-all duration-300 overflow-hidden sidebar-scroll',
          // desktop: always visible, width controlled
          'lg:relative lg:flex lg:h-full',
          // mobile: dropdown
          collapsed ? 'h-auto max-h-screen' : 'max-h-0 lg:max-h-full',
          'lg:max-h-full w-full lg:w-[240px] xl:w-[260px]',
        ].join(' ')}
        style={{ minHeight: 0 }}
      >
        {/* Logo */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-6">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
            <HiOutlineDocumentText className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide leading-none">BlogAdmin</p>
            <p className="text-xs text-slate-500 mt-0.5">Control Panel</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block mx-4 h-px bg-white/5" />

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scroll">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setCollapsed(false)}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={[
                      'h-4.5 w-4.5 flex-shrink-0 transition-colors',
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300',
                    ].join(' ')}
                    style={{ width: '1.125rem', height: '1.125rem' }}
                  />
                  {label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Logout */}
        <div className="mt-auto px-3 pb-6 pt-2">
          <div className="mx-0 mb-4 h-px bg-white/5" />
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 border border-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-150 disabled:opacity-60"
          >
            <HiOutlineLogout
              className="flex-shrink-0 text-slate-500 group-hover:text-red-400 transition-colors"
              style={{ width: '1.125rem', height: '1.125rem' }}
            />
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </aside>
    </>
  )
}
