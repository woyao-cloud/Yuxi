### Task 1.4：布局组件


**Files:**
- Create: `web-react/src/layouts/app-layout.tsx`
- Create: `web-react/src/layouts/blank-layout.tsx`
- Create: `web-react/src/components/shared/loading.tsx`

**Interfaces:**
- Consumes: Task 1.2 鐨?`useChatStore`, `useAuthStore`, `useUIStore`
- Produces: 搴旂敤鐨勫竷灞€澶栧３

- [ ] **Step 1: 鍒涘缓 `src/components/shared/loading.tsx`**

```tsx
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  fullScreen?: boolean
  text?: string
}

export default function Loading({ fullScreen = true, text = '鍔犺浇涓?..' }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'h-screen w-screen' : 'h-full w-full'}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 鍒涘缓 `src/layouts/blank-layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'

export default function BlankLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 3: 鍒涘缓 `src/layouts/app-layout.tsx`锛堥鏋讹紝鍚庣画闃舵濉厖缁嗚妭锛?*

```tsx
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <aside className="flex h-full w-[230px] flex-col border-r bg-muted/30">
        {/* 渚ц竟鏍忓唴瀹瑰皢鍦?Task 2.2 涓疄鐜?*/}
        <div className="flex h-full items-center justify-center text-muted-foreground">
          渚ц竟鏍?        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: 鏇存柊 `src/App.tsx` 闆嗘垚璺敱鍜屼富棰?*

```tsx
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRouter from '@/router'
import { useThemeStore } from '@/stores/theme-store'
import { setAuthStore } from '@/apis/client'
import { useAuthStore } from '@/stores/auth-store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1
    }
  }
})

export default function App() {
  const themeMode = useThemeStore((s) => s.mode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark')
  }, [themeMode])

  useEffect(() => {
    setAuthStore(useAuthStore)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 5: 鎻愪氦**

```bash
git add web-react/src/layouts/ web-react/src/components/shared/ web-react/src/App.tsx
git commit -m "feat(web-react): add layouts, loading component, and App.tsx integration"
```

---

