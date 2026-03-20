import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

export default function PrivateRoute({ children }) {
  const [status, setStatus] = useState('loading') 

  useEffect(() => {
    axiosInstance
      .get('/auth/currentUser')
      .then(({ data }) => {
        if (data?.role === 'admin') {
          setStatus('authorized')
        } else {
          setStatus('unauthorized')
        }
      })
      .catch(() => {
        setStatus('unauthorized')
      })
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
          <p className="text-sm font-medium text-slate-500">Verifying access…</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" replace />
  }

  return children
}
