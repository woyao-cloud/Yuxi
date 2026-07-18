import { apiClient } from './client'

export const threadApi = {
  getThreads: (agentId?: string, limit = 100, offset = 0) => {
    const params: Record<string, unknown> = { limit, offset }
    if (agentId) {
      params.agent_id = agentId
    }
    return apiClient.get<{ threads: unknown[]; total: number; has_more: boolean }>(
      '/api/chat/threads',
      params
    )
  },

  createThread: (agentId: string, title?: string, metadata?: Record<string, unknown>) =>
    apiClient.post('/api/chat/thread', {
      agent_id: agentId,
      title: title || '新的对话',
      metadata: metadata || {}
    }),

  updateThread: (threadId: string, title?: string, isPinned?: boolean) =>
    apiClient.put(`/api/chat/thread/${threadId}`, {
      title,
      is_pinned: isPinned
    }),

  deleteThread: (threadId: string) =>
    apiClient.delete(`/api/chat/thread/${threadId}`)
}