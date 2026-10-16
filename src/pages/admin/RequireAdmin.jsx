import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RequireAdmin() {
  const { ready, configured, isAdmin } = useAuth()

  if (!configured) return <Navigate to="/admin/login" replace />
  if (!ready) {
    return (
      <div className="login-wrap">
        <p>Checking the admin session…</p>
      </div>
    )
  }
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
