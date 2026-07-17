### Task 1.3：路由定义与认证守卫


**Files:**
- Create: `web-react/src/router/routes.ts`
- Create: `web-react/src/router/auth-guard.tsx`
- Create: `web-react/src/router/index.tsx`

**Interfaces:**
- Consumes: Task 1.2 鐨?`useAuthStore`
- Produces: 瀹屾暣鐨勮矾鐢遍厤缃紝鍚璇佸畧鍗拰鎳掑姞杞?
- [ ] **Step 1: 鍒涘缓 `src/router/routes.ts`**

```ts
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import AppLayout from '@/layouts/app-layout'
import BlankLayout from '@/layouts/blank-layout'
import AuthGuard from './auth-guard'

const HomePage = lazy(() => import('@/features/auth/pages/home-page'))
const LoginPage = lazy(() => import('@/features/auth/pages/login-page'))
const OIDCCallbackPage = lazy(() => import('@/features/auth/pages/oidc-callback-page'))
const CLIAuthAuthorizePage = lazy(() => import('@/features/auth/pages/cli-auth-authorize-page'))
const AgentPage = lazy(() => import('@/features/agent/pages/agent-page'))
const WorkspacePage = lazy(() => import('@/features/workspace/pages/workspace-page'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/dashboard-page'))
const ModelManagePage = lazy(() => import('@/features/model-manage/pages/model-manage-page'))
const ExtensionsPage = lazy(() => import('@/features/extensions/pages/extensions-page'))
const KnowledgeBaseDetailPage = lazy(() => import('@/features/extensions/knowledge-base/knowledge-base-detail-page'))
const McpDetailView = lazy(() => import('@/features/extensions/components/mcp-detail-view'))
const SkillDetailView = lazy(() => import('@/features/extensions/components/skill-detail-view'))
const NotFoundPage = lazy(() => import('@/features/auth/pages/not-found-page'))

export const routes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/agent', element: <AgentPage /> },
          { path: '/agent/:threadId', element: <AgentPage /> },
          { path: '/workspace', element: <WorkspacePage /> },
          { path: '/model-manage', element: <ModelManagePage /> },
          {
            path: '/extensions',
            element: <ExtensionsPage />,
            children: [
              { path: 'knowledge-base/:kbId', element: <KnowledgeBaseDetailPage /> },
              { path: 'mcp/:slug', element: <McpDetailView /> },
              { path: 'skill/:slug', element: <SkillDetailView /> }
            ]
          },
          {
            path: '/dashboard',
            element: <DashboardPage />
          },
          { path: '/auth/cli/authorize', element: <CLIAuthAuthorizePage /> }
        ]
      }
    ]
  },
  {
    element: <BlankLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/auth/oidc/callback', element: <OIDCCallbackPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]
```

- [ ] **Step 2: 鍒涘缓 `src/router/auth-guard.tsx`**

```tsx
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
```

- [ ] **Step 3: 鍒涘缓 `src/router/index.tsx`**

```tsx
import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import Loading from '@/components/shared/loading'

const router = createBrowserRouter(routes)

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
```

- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/src/router/
git commit -m "feat(web-react): add router with auth guards and lazy loading"
```

---

