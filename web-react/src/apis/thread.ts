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

  searchThreads: (
    query: string,
    options: { agentId?: string; limit?: number; offset?: number } = {}
  ) => {
    const params: Record<string, unknown> = { q: query, limit: options.limit || 20, offset: options.offset || 0 }
    if (options.agentId) {
      params.agent_id = options.agentId
    }
    return apiClient.get('/api/chat/threads/search', params)
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
    apiClient.delete(`/api/chat/thread/${threadId}`),

  getThreadHistory: (threadId: string) =>
    apiClient.get(`/api/chat/thread/${threadId}/history`),

  getThreadState: (threadId: string, options: { includeMessages?: boolean } = {}) =>
    apiClient.get(
      `/api/chat/thread/${threadId}/state${options.includeMessages ? '?include_messages=true' : ''}`
    ),

  getThreadAttachments: (threadId: string) =>
    apiClient.get(`/api/chat/thread/${threadId}/attachments`),

  getThreadFiles: (threadId: string, path = '/home/gem/user-data', recursive = false) =>
    apiClient.get(
      `/api/chat/thread/${threadId}/files?path=${encodeURIComponent(path)}&recursive=${recursive}`
    ),

  getThreadFileContent: (threadId: string, path: string, offset = 0, limit = 2000) =>
    apiClient.get(
      `/api/chat/thread/${threadId}/files/content?path=${encodeURIComponent(path)}&offset=${offset}&limit=${limit}`
    ),

  getThreadArtifacts: (threadId: string, path: string, download = false) => {
    const encodedPath = path
      .split('/')
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join('/')
    const query = download ? '?download=true' : ''
    return apiClient.get(`/api/chat/thread/${threadId}/artifacts/${encodedPath}${query}`)
  },

  saveThreadArtifact: (threadId: string, path: string) =>
    apiClient.post(`/api/chat/thread/${threadId}/artifacts/save`, { path }),

  uploadThreadAttachment: (threadId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/api/chat/thread/${threadId}/attachments`, formData)
  },

  deleteThreadAttachment: (threadId: string, fileId: string) =>
    apiClient.delete(`/api/chat/thread/${threadId}/attachments/${fileId}`)
}