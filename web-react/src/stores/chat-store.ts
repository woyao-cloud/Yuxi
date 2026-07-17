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