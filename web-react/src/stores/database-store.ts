import { create } from 'zustand'
import { knowledgeApi } from '@/apis/knowledge'
import { useAuthStore } from './auth-store'

interface Database {
  kb_id: string
  name: string
  created_at: string
  [key: string]: unknown
}

interface DatabaseState {
  databases: Database[]
  isLoading: boolean
  loadDatabases: () => Promise<void>
}

export const useDatabaseStore = create<DatabaseState>()((set) => ({
  databases: [],
  isLoading: false,

  loadDatabases: async () => {
    set({ isLoading: true })
    try {
      const { isAdmin } = useAuthStore.getState()
      const data = isAdmin
        ? await knowledgeApi.getDatabases()
        : await knowledgeApi.getAccessibleDatabases()
      const list = ((data as { databases?: unknown[] })?.databases || []) as Database[]
      const sorted = list.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0
        if (!timeA && !timeB) return 0
        if (!timeA) return 1
        if (!timeB) return -1
        return timeB - timeA
      })
      set({ databases: sorted })
    } catch (error) {
      console.error('加载数据库列表失败:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  }
}))