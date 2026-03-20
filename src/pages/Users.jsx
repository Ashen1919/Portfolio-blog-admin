import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

const roleColors = {
  admin: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  user: 'bg-slate-100 text-slate-600 border-slate-200',
  moderator: 'bg-amber-50 text-amber-700 border-amber-100',
}

function RoleBadge({ role }) {
  const cls = roleColors[role?.toLowerCase()] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {role}
    </span>
  )
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const pageSize = 20

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get(`/admin/users?page=${page}&size=${pageSize}`)
      .then(({ data }) => {
        setUsers(data?.content ?? (Array.isArray(data) ? data : []))
        setTotal(data?.totalElements ?? (Array.isArray(data) ? data.length : 0))
      })
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Users</h1>
        <p className="mt-0.5 text-sm text-slate-500">{total} registered users</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50">
                  {['#', 'Username', 'Email', 'Role', 'Created At', 'Updated At'].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-slate-400">{page * pageSize + idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {/* Avatar letter */}
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                          {u.username?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="text-sm font-medium text-ink">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-500">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-500">
                      {formatDate(u.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page + 1} of {totalPages} &middot; {total} total users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
