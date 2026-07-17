import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import Loading from '@/components/shared/loading'

export default function OIDCCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      useAuthStore.setState({ token, isLoggedIn: true })
      navigate('/agent', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate, login])

  return <Loading text="处理 OIDC 回调..." />
}