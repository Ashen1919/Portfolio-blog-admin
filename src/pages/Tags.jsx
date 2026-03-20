import { useEffect, useState } from 'react'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import toast from 'react-hot-toast'
import axiosInstance from '../api/axiosInstance'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'

function TagForm({ initial = '', onSubmit, loading }) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return }
    if (trimmed.length > 50) { setError('Name must be at most 50 characters.'); return }
    setError('')
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="tag-name">
          Tag Name
        </label>
        <input
          id="tag-name"
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError('') }}
          placeholder="e.g. JavaScript"
          maxLength={50}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all"
        />
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        <p className="mt-1 text-xs text-slate-400">{name.length}/50</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-500 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors disabled:opacity-60"
      >
        {loading ? 'Saving…' : 'Save Tag'}
      </button>
    </form>
  )
}

export default function Tags() {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const pageSize = 50

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchTags = (p = page) => {
    setLoading(true)
    axiosInstance
      .get(`/api/tags?page=${p}&size=${pageSize}`)
      .then(({ data }) => {
        setTags(data?.content ?? (Array.isArray(data) ? data : []))
        setTotal(data?.totalElements ?? (Array.isArray(data) ? data.length : 0))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTags(page) }, [page])

  const handleCreate = async (name) => {
    setSaving(true)
    try {
      await axiosInstance.post('/admin/tags', { name })
      toast.success('Tag created!')
      setShowCreate(false)
      fetchTags(page)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to create tag.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = async (name) => {
    setSaving(true)
    try {
      await axiosInstance.put(`/admin/tags/${editTarget.id}`, { name })
      toast.success('Tag updated!')
      setEditTarget(null)
      fetchTags(page)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to update tag.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axiosInstance.delete(`/admin/tags/${deleteTarget.id}`)
      toast.success('Tag deleted.')
      setDeleteTarget(null)
      fetchTags(page)
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Failed to delete tag.')
    } finally {
      setDeleting(false)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tags</h1>
          <p className="mt-0.5 text-sm text-slate-500">{total} tags</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-600 transition-all"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Tag
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-5 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ) : tags.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No tags yet. Create one!</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50">
                {['#', 'Name', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tags.map((tag, idx) => (
                <tr key={tag.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-slate-400">{page * pageSize + idx + 1}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 border border-indigo-100">
                      {tag.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditTarget(tag)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      >
                        <HiOutlinePencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tag)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <HiOutlineTrash className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page + 1} of {totalPages}</p>
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

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Tag" size="sm">
        <TagForm onSubmit={handleCreate} loading={saving} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Tag" size="sm">
        {editTarget && (
          <TagForm initial={editTarget.name} onSubmit={handleEdit} loading={saving} />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Tag"
        message={`Are you sure you want to delete the tag "${deleteTarget?.name}"? This may affect posts using it.`}
      />
    </div>
  )
}
