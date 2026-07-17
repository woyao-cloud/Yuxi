# Task 1.4 Report: 布局组件

## What was created/modified

- **Created**: `src/components/shared/loading.tsx` - Reusable loading component with spinner and text, supports fullScreen mode
- **Created**: `src/layouts/blank-layout.tsx` - Blank layout with centered Outlet for auth/login pages
- **Created**: `src/layouts/app-layout.tsx` - App layout skeleton with sidebar placeholder (230px) and main content area
- **Modified**: `src/App.tsx` - Integrated QueryClientProvider, router (AppRouter), theme store (dark mode toggle on `document.documentElement.classList`), and auth store wiring (`setAuthStore`)

## Test results

- **ESLint**: Passed (no errors, no warnings)
- **TypeScript (tsc --noEmit)**: Passed (no errors)

## Files changed

```
web-react/src/components/shared/loading.tsx  (create)
web-react/src/layouts/app-layout.tsx         (create)
web-react/src/layouts/blank-layout.tsx       (create)
web-react/src/App.tsx                        (modified)
```

## Commit

```
ab16fc2a feat(web-react): add layouts, loading component, and App.tsx integration
```