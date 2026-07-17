### Task 2.1：Auth 功能模块

- Create: `web-react/src/features/auth/pages/not-found-page.tsx`
- Create: `web-react/src/features/auth/components/login-form.tsx`
- Create: `web-react/src/features/auth/hooks/use-login.ts`

**Interfaces:**
- Consumes: `useAuthStore`, `apiClient`, shadcn/ui 缁勪欢
- Produces: 瀹屾暣鐨勭櫥褰曟祦绋嬪拰鍏紑椤甸潰

- [ ] **Step 1: 鍒涘缓 `login-form.tsx` 缁勪欢**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export default function LoginForm() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ loginId, password })
      const redirect = sessionStorage.getItem('redirect') || searchParams.get('redirect') || '/agent'
      navigate(redirect, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : '鐧诲綍澶辫触')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle className="text-center text-2xl">鐧诲綍 Yuxi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">璐﹀彿 / 鎵嬫満鍙?/label>
            <Input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="璇疯緭鍏ヨ处鍙锋垨鎵嬫満鍙? required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">瀵嗙爜</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="璇疯緭鍏ュ瘑鐮? required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            鐧诲綍
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: 鍒涘缓 `login-page.tsx`**

```tsx
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
```

- [ ] **Step 3: 鍒涘缓 `home-page.tsx`**锛堢畝鍗曢椤垫垨閲嶅畾鍚戯級

```tsx
import { useAuthStore } from '@/stores/auth-store'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const navigate = useNavigate()

  if (isLoggedIn) return <Navigate to="/agent" replace />

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Yuxi</h1>
      <p className="text-muted-foreground">鏅鸿兘鐭ヨ瘑搴撲笌鐭ヨ瘑鍥捐氨鏅鸿兘浣撳紑鍙戝钩鍙?/p>
      <Button onClick={() => navigate('/login')}>寮€濮嬩娇鐢?/Button>
    </div>
  )
}
```

- [ ] **Step 4: 鍒涘缓 `oidc-callback-page.tsx` 鍜?`cli-auth-authorize-page.tsx`**锛堥鏋讹級

```tsx
// oidc-callback-page.tsx
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
      // OIDC 鐧诲綍鎴愬姛鍚庡瓨鍌?token
      useAuthStore.setState({ token, isLoggedIn: true })
      navigate('/agent', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate, login])

  return <Loading text="澶勭悊 OIDC 鍥炶皟..." />
}
```

- [ ] **Step 5: 鍒涘缓 `not-found-page.tsx`**

```tsx
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-lg text-muted-foreground">椤甸潰鏈壘鍒?/p>
      <Button onClick={() => navigate('/')}>杩斿洖棣栭〉</Button>
    </div>
  )
}
```

- [ ] **Step 6: 鎻愪氦**

```bash
git add web-react/src/features/auth/
git commit -m "feat(web-react): add auth module (login, home, OIDC, CLI auth, 404)"
```

---

