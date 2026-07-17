import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

interface RoleGuardProps {
  requiredRole: 'admin' | 'superadmin'
  redirectTo?: string
}

export default function RoleGuard({ requiredRole, redirectTo = '/agent' }: RoleGuardProps) {
  const { isLoggedIn, isAdmin, isSuperAdmin } = useAuthStore()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === 'superadmin' && !isSuperAdmin) {
    return <Navigate to={redirectTo} replace />
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}