import { useAuthStore } from '@/stores/auth-store'
import { Navigate } from 'react-router-dom'
import LoginForm from '../components/login-form'

export default function LoginPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  if (isLoggedIn) return <Navigate to="/agent" replace />
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <LoginForm />
    </div>
  )
}