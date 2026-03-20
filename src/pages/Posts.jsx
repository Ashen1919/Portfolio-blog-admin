import { useEffect, useState } from 'react'
import { HiOutlineEye, HiOutlineSearch } from 'react-icons/hi'
import axiosInstance from '../api/axiosInstance'
import Modal from '../components/Modal'

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function TagBadge({ name }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 border border-indigo-100">
      {name}
    </span>
  )
}

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const pageSize = 20

  const [search, setSearch] = useState('')
  const [viewPost, setViewPost] = useState(null)

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get(`/api/posts/allPosts?page=${page}&size=${pageSize}`)
      .then(({ data }) => {
        setPosts(data?.content ?? (Array.isArray(data) ? data : []))
        setTotal(data?.totalElements ?? (Array.isArray(data) ? data.length : 0))
      })
      .finally(() => setLoading(false))
  }, [page])

  const filtered = search.trim()
    ? posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.author?.username?.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(search.toLowerCase()),
      )
    : posts

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Posts</h1>
          <p className="mt-0.5 text-sm text-slate-500">{total} total posts</p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <HiOutlineSearch className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">No posts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50">
                  {['#', 'Title', 'Category', 'Tags', 'Author', 'Created At', 'Actions'].map((h) => (
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
                {filtered.map((post, idx) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {page * pageSize + idx + 1}
                    </td>
                    <td className="max-w-[220px] px-5 py-3.5">
                      <p className="truncate text-sm font-medium text-ink">{post.title}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {post.category?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {post.tags?.length
                          ? post.tags.slice(0, 3).map((t) => <TagBadge key={t.id} name={t.name} />)
                          : <span className="text-xs text-slate-400">—</span>}
                        {post.tags?.length > 3 && (
                          <span className="text-xs text-slate-400">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {post.author?.username ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-slate-500">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setViewPost(post)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      >
                        <HiOutlineEye className="h-3.5 w-3.5" />
                        View
                      </button>
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
            Page {page + 1} of {totalPages}
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

      {/* Post View Modal */}
      <Modal
        isOpen={!!viewPost}
        onClose={() => setViewPost(null)}
        title="Post Details"
        size="xl"
      >
        {viewPost && (
          <div className="space-y-5">
            {/* Title */}
            <h2 className="text-2xl font-bold text-ink leading-tight">{viewPost.title}</h2>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Author</p>
                <p className="mt-0.5 font-medium text-ink">{viewPost.author?.username ?? '—'}</p>
                <p className="text-xs text-slate-400">{viewPost.author?.email ?? ''}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Category</p>
                <p className="mt-0.5 font-medium text-ink">{viewPost.category?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Created</p>
                <p className="mt-0.5 text-slate-700">{formatDate(viewPost.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Updated</p>
                <p className="mt-0.5 text-slate-700">{formatDate(viewPost.updatedAt)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewPost.tags?.length
                    ? viewPost.tags.map((t) => <TagBadge key={t.id} name={t.name} />)
                    : <span className="text-xs text-slate-400">No tags</span>}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Content</p>
              <div className="rounded-xl border border-slate-100 bg-white p-5">
                <div
                  className="prose-content"
                  dangerouslySetInnerHTML={{ __html: viewPost.content }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
