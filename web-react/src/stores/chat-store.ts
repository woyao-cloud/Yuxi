import { create } from 'zustand'
import { threadApi } from '@/apis/thread'

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
  hasMoreThreads: boolean
  isLoadingMoreThreads: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setCurrentThreadId: (id: string | null) => void
  setThreads: (threads: ChatThread[]) => void
  upsertThread: (thread: ChatThread) => void
  deleteThread: (id: string) => void
  setConversationSearchOpen: (open: boolean) => void
  loadThreads: (agentId?: string) => Promise<void>
  createThread: (agentId: string, title?: string) => Promise<ChatThread | null>
  deleteThreadRemote: (threadId: string) => Promise<void>
  updateThread: (threadId: string, title?: string, isPinned?: boolean) => Promise<void>
}

export const useChatStore = create<ChatState>()((set, get) => ({
  sidebarCollapsed: false,
  currentThreadId: null,
  threads: [],
  conversationSearchOpen: false,
  hasMoreThreads: false,
  isLoadingMoreThreads: false,

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
  setConversationSearchOpen: (open) => set({ conversationSearchOpen: open }),

  loadThreads: async (agentId?: string) => {
    set({ isLoadingMoreThreads: true })
    try {
      const data = await threadApi.getThreads(agentId)
      const threadList = (data.threads || []) as ChatThread[]
      set({
        threads: threadList,
        hasMoreThreads: data.has_more || false
      })
    } catch (error) {
      console.error('Failed to load threads:', error)
    } finally {
      set({ isLoadingMoreThreads: false })
    }
  },

  createThread: async (agentId: string, title?: string) => {
    try {
      const data = await threadApi.createThread(agentId, title)
      const thread = data as unknown as ChatThread
      if (thread?.id) {
        get().upsertThread(thread)
      }
      return thread
    } catch (error) {
      console.error('Failed to create thread:', error)
      return null
    }
  },

  deleteThreadRemote: async (threadId: string) => {
    try {
      await threadApi.deleteThread(threadId)
      get().deleteThread(threadId)
    } catch (error) {
      console.error('Failed to delete thread:', error)
    }
  },

  updateThread: async (threadId: string, title?: string, isPinned?: boolean) => {
    try {
      await threadApi.updateThread(threadId, title, isPinned)
      set((s) => ({
        threads: s.threads.map((t) =>
          t.id === threadId
            ? { ...t, ...(title !== undefined ? { title } : {}), ...(isPinned !== undefined ? { is_pinned: isPinned } : {}) }
            : t
        )
      }))
    } catch (error) {
      console.error('Failed to update thread:', error)
    }
  }
}))