import { useEffect, useState } from 'react'
import {
  HiOutlineDocumentText,
  HiOutlineCollection,
  HiOutlineTag,
  HiOutlineUsers,
} from 'react-icons/hi'
import axiosInstance from '../api/axiosInstance'
import StatCard from '../components/StatCard'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: null, categories: null, tags: null, users: null })
  const [recentPosts, setRecentPosts] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Current user
    axiosInstance.get('/auth/currentUser').then(({ data }) => setUser(data)).catch(() => {})

    // Posts
    axiosInstance.get('/api/posts/allPosts').then(({ data }) => {
      const posts = data?.content ?? data ?? []
      const total = data?.totalElements ?? posts.length
      setStats((s) => ({ ...s, posts: total }))
      setRecentPosts(
        [...posts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
      )
    }).catch(() => setStats((s) => ({ ...s, posts: 0 })))

    // Categories
    axiosInstance.get('/api/categories').then(({ data }) => {
      setStats((s) => ({ ...s, categories: Array.isArray(data) ? data.length : data?.totalElements ?? 0 }))
    }).catch(() => setStats((s) => ({ ...s, categories: 0 })))

    // Tags
    axiosInstance.get('/api/tags?page=0&size=50').then(({ data }) => {
      const list = data?.content ?? data ?? []
      setStats((s) => ({ ...s, tags: data?.totalElements ?? list.length }))
    }).catch(() => setStats((s) => ({ ...s, tags: 0 })))

    // Users
    axiosInstance.get('/admin/users?page=0&size=1').then(({ data }) => {
      setStats((s) => ({ ...s, users: data?.totalElements ?? (Array.isArray(data) ? data.length : 0) }))
    }).catch(() => setStats((s) => ({ ...s, users: 0 })))
  }, [])

  const cards = [
    {
      label: 'Total Posts',
      icon: HiOutlineDocumentText,
      count: stats.posts,
      colorClass: 'bg-indigo-500',
      glowClass: 'card-glow-indigo',
      bgClass: 'bg-indigo-400',
    },
    {
      label: 'Categories',
      icon: HiOutlineCollection,
      count: stats.categories,
      colorClass: 'bg-violet-500',
      glowClass: 'card-glow-violet',
      bgClass: 'bg-violet-400',
    },
    {
      label: 'Total Tags',
      icon: HiOutlineTag,
      count: stats.tags,
      colorClass: 'bg-sky-500',
      glowClass: 'card-glow-sky',
      bgClass: 'bg-sky-400',
    },
    {
      label: 'Total Users',
      icon: HiOutlineUsers,
      count: stats.users,
      colorClass: 'bg-emerald-500',
      glowClass: 'card-glow-emerald',
      bgClass: 'bg-emerald-400',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back — here's your blog at a glance.</p>
      </div>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-500 p-6 shadow-lg shadow-indigo-200">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">Logged in as</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {user ? `@${user.username}` : <span className="inline-block h-8 w-36 animate-pulse rounded-lg bg-white/20" />}
          </p>
          <p className="mt-0.5 text-sm text-indigo-200">
            {user?.email ?? ''}
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {user?.role?.toUpperCase() ?? 'ADMIN'}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-ink">Recent Posts</h2>
        <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
          {recentPosts.length === 0 && stats.posts === null ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-5 animate-pulse rounded bg-slate-100" />
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">No posts found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50">
                    {['Title', 'Category', 'Author', 'Created At'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="max-w-[220px] truncate px-5 py-3.5 text-sm font-medium text-ink">
                        {post.title}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {post.category?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {post.author?.username ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">
                        {formatDate(post.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
