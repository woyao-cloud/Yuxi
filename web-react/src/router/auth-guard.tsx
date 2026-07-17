import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export default function AuthGuard() {
  const { isLoggedIn, token, getCurrentUser, user } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (token && !user) {
      getCurrentUser().catch(() => {
        useAuthStore.getState().logout()
      })
    }
  }, [token, user, getCurrentUser])

  if (!isLoggedIn) {
    sessionStorage.setItem('redirect', location.pathname)
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}