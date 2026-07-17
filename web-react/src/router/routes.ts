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