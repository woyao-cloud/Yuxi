import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import Loading from '@/components/shared/loading'

export default function AuthGuard() {
  const { isLoggedIn, token, getCurrentUser, user } = useAuthStore()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (token && !user && !isLoading) {
      setIsLoading(true)
      getCurrentUser()
        .catch(() => {
          useAuthStore.getState().logout()
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [token, user, getCurrentUser, isLoading])

  if (!isLoggedIn) {
    sessionStorage.setItem('redirect', location.pathname)
    return <Navigate to="/login" replace />
  }

  if (token && !user) {
    return <Loading text="验证登录状态..." />
  }

  return <Outlet />
}