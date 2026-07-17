# Task 1.3 Report: 路由定义与认证守卫

## What was created

- **`src/router/routes.ts`** — Route definitions with lazy-loaded pages, organized into:
  - Authenticated routes (wrapped in `AuthGuard` + `AppLayout`): agent, workspace, model-manage, extensions (with nested knowledge-base, mcp, skill detail), dashboard, cli-auth
  - Public routes (wrapped in `BlankLayout`): home, login, oidc-callback
  - Catch-all 404 route
- **`src/router/auth-guard.tsx`** — Auth guard component that checks `isLoggedIn` from `useAuthStore`, redirects to `/login` if unauthenticated, and fetches current user profile on mount when token exists but user is missing
- **`src/router/index.tsx`** — Router provider with `createBrowserRouter` wrapped in `Suspense` with a `Loading` fallback

## Test results

| Check | Result |
|-------|--------|
| `pnpm lint --no-fix` | No errors |
| `pnpm tsc --noEmit` | No errors |

## Files changed

```
src/router/auth-guard.tsx    (created)
src/router/index.tsx         (created)
src/router/routes.ts         (created)
```