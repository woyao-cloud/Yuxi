import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import Loading from '@/components/shared/loading'

export default function CLIAuthAuthorizePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=/auth/cli/authorize', { replace: true })
      return
    }

    const token = searchParams.get('token')
    const redirectUri = searchParams.get('redirect_uri')
    if (token && redirectUri) {
      window.location.href = `${redirectUri}?token=${token}`
    } else {
      navigate('/agent', { replace: true })
    }
  }, [searchParams, navigate, isLoggedIn])

  return <Loading text="处理 CLI 授权..." />
}