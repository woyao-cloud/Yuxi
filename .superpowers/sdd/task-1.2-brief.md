### Task 1.2：Zustand Stores


**Files:**
- Create: `web-react/src/stores/auth-store.ts`
- Create: `web-react/src/stores/agent-store.ts`
- Create: `web-react/src/stores/chat-store.ts`
- Create: `web-react/src/stores/theme-store.ts`
- Create: `web-react/src/stores/ui-store.ts`

**Interfaces:**
- Consumes: Task 1.1 鐨?`apiClient`
- Produces: 鍏ㄥ眬鐘舵€?store锛屼緵鎵€鏈夌粍浠朵娇鐢?
- [ ] **Step 1: 鍒涘缓 `src/stores/auth-store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  uid: string
  phone_number: string
  avatar: string
  role: string
  department_id: string | null
  department_name: string
}

interface LoginCredentials {
  loginId: string
  password: string
}

interface AuthState {
  token: string
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  getCurrentUser: () => Promise<void>
  initialize: (admin: { username: string; password: string }) => Promise<void>
  checkFirstRun: () => Promise<boolean>
  getAuthHeaders: () => Record<string, string>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: '',
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      isSuperAdmin: false,

      login: async (credentials) => {
        const formData = new FormData()
        formData.append('username', credentials.loginId)
        formData.append('password', credentials.password)

        const response = await fetch('/api/auth/token', { method: 'POST', body: formData })
        if (!response.ok) {
          if (response.status === 423) {
            const error = new Error('璐﹀彿宸茶閿佸畾') as Error & { status: number; headers: Headers }
            error.status = 423
            error.headers = response.headers
            throw error
          }
          const err = await response.json()
          throw new Error(err.detail || '鐧诲綍澶辫触')
        }

        const data = await response.json()
        const user = {
          id: data.user_id,
          username: data.username,
          uid: data.uid,
          phone_number: data.phone_number || '',
          avatar: data.avatar || '',
          role: data.role,
          department_id: data.department_id || null,
          department_name: data.department_name || ''
        }

        set({
          token: data.access_token,
          user,
          isLoggedIn: true,
          isAdmin: user.role === 'admin' || user.role === 'superadmin',
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      logout: () => {
        set({
          token: '',
          user: null,
          isLoggedIn: false,
          isAdmin: false,
          isSuperAdmin: false
        })
      },

      getCurrentUser: async () => {
        const { token } = get()
        if (!token) return
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('鑾峰彇鐢ㄦ埛淇℃伅澶辫触')
        const userData = await response.json()
        const user = {
          id: userData.id,
          username: userData.username,
          uid: userData.uid,
          phone_number: userData.phone_number || '',
          avatar: userData.avatar || '',
          role: userData.role,
          department_id: userData.department_id || null,
          department_name: userData.department_name || ''
        }
        set({
          user,
          isLoggedIn: true,
          isAdmin: user.role === 'admin' || user.role === 'superadmin',
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      initialize: async (admin) => {
        const response = await fetch('/api/auth/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(admin)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.detail || '鍒濆鍖栫鐞嗗憳澶辫触')
        }
        const data = await response.json()
        const user = {
          id: data.user_id,
          username: data.username,
          uid: data.uid,
          phone_number: data.phone_number || '',
          avatar: data.avatar || '',
          role: data.role,
          department_id: data.department_id || null,
          department_name: data.department_name || ''
        }
        set({
          token: data.access_token,
          user,
          isLoggedIn: true,
          isAdmin: true,
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      checkFirstRun: async () => {
        try {
          const response = await fetch('/api/auth/check-first-run')
          const data = await response.json()
          return data.first_run
        } catch {
          return false
        }
      },

      getAuthHeaders: () => {
        const { token } = get()
        return token ? { Authorization: `Bearer ${token}` } : {}
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token })
    }
  )
)
```

- [ ] **Step 2: 鍒涘缓 `src/stores/agent-store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Agent {
  id: string
  agent_id?: string
  slug?: string
  name: string
  is_builtin?: boolean
  is_subagent?: boolean
  configurable_items?: Record<string, unknown>
  config_json?: { context?: Record<string, unknown> }
}

interface AgentState {
  selectedAgentId: string | null
  agents: Agent[]
  agentConfig: Record<string, unknown>
  originalAgentConfig: Record<string, unknown>
  isInitialized: boolean
  isInitializing: boolean
  setSelectedAgentId: (id: string | null) => void
  setAgents: (agents: Agent[]) => void
  setAgentConfig: (config: Record<string, unknown>) => void
  setInitialized: (val: boolean) => void
  setInitializing: (val: boolean) => void
  reset: () => void
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      selectedAgentId: null,
      agents: [],
      agentConfig: {},
      originalAgentConfig: {},
      isInitialized: false,
      isInitializing: false,

      setSelectedAgentId: (id) => set({ selectedAgentId: id }),
      setAgents: (agents) => set({ agents }),
      setAgentConfig: (config) => set({ agentConfig: config, originalAgentConfig: { ...config } }),
      setInitialized: (val) => set({ isInitialized: val }),
      setInitializing: (val) => set({ isInitializing: val }),
      reset: () => set({
        selectedAgentId: null,
        agents: [],
        agentConfig: {},
        originalAgentConfig: {},
        isInitialized: false,
        isInitializing: false
      })
    }),
    {
      name: 'agent-store',
      partialize: (state) => ({ selectedAgentId: state.selectedAgentId })
    }
  )
)
```

- [ ] **Step 3: 鍒涘缓 `src/stores/chat-store.ts`**

```ts
import { create } from 'zustand'

interface ChatThread {
  id: string
  title: string
  is_pinned?: boolean
  updated_at?: string
  created_at?: string
}

interface ChatState {
  sidebarCollapsed: boolean
  currentThreadId: string | null
  threads: ChatThread[]
  conversationSearchOpen: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setCurrentThreadId: (id: string | null) => void
  setThreads: (threads: ChatThread[]) => void
  upsertThread: (thread: ChatThread) => void
  deleteThread: (id: string) => void
  setConversationSearchOpen: (open: boolean) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  sidebarCollapsed: false,
  currentThreadId: null,
  threads: [],
  conversationSearchOpen: false,

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCurrentThreadId: (id) => set({ currentThreadId: id }),
  setThreads: (threads) => set({ threads }),
  upsertThread: (thread) =>
    set((s) => {
      const exists = s.threads.find((t) => t.id === thread.id)
      if (exists) {
        return { threads: s.threads.map((t) => (t.id === thread.id ? thread : t)) }
      }
      return { threads: [thread, ...s.threads] }
    }),
  deleteThread: (id) =>
    set((s) => ({ threads: s.threads.filter((t) => t.id !== id) })),
  setConversationSearchOpen: (open) => set({ conversationSearchOpen: open })
}))
```

- [ ] **Step 4: 鍒涘缓 `src/stores/theme-store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () =>
        set((s) => {
          const next = s.mode === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { mode: next }
        }),
      setTheme: (mode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark')
        set({ mode })
      }
    }),
    { name: 'theme-store' }
  )
)
```

- [ ] **Step 5: 鍒涘缓 `src/stores/ui-store.ts`**

```ts
import { create } from 'zustand'

interface UIState {
  settingsModalOpen: boolean
  settingsInitialTab: string
  showDebugModal: boolean
  openSettingsModal: (tab?: string) => void
  closeSettingsModal: () => void
  setShowDebugModal: (show: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  settingsModalOpen: false,
  settingsInitialTab: '',
  showDebugModal: false,
  openSettingsModal: (tab = '') => set({ settingsModalOpen: true, settingsInitialTab: tab }),
  closeSettingsModal: () => set({ settingsModalOpen: false, settingsInitialTab: '' }),
  setShowDebugModal: (show) => set({ showDebugModal: show })
}))
```

- [ ] **Step 6: 鎻愪氦**

```bash
git add web-react/src/stores/
git commit -m "feat(web-react): add Zustand stores (auth, agent, chat, theme, ui)"
```

---

