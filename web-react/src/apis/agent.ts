import { apiClient } from './client'
import { useAuthStore } from '@/stores/auth-store'

export const agentApi = {
  getAgents: (params?: { includeSubagents?: boolean }) => {
    const queryParams = new URLSearchParams()
    if (params?.includeSubagents) queryParams.set('include_subagents', 'true')
    const query = queryParams.toString()
    return apiClient.get<{ agents: unknown[] }>(query ? `/api/agent?${query}` : '/api/agent')
  },

  getAgentBackends: () => apiClient.get('/api/agent/backends'),

  getAgentDetail: (agentId: string) =>
    apiClient.get<{ agent: unknown }>(`/api/agent/${agentId}`),

  getAgentHistory: (threadId: string) =>
    apiClient.get(`/api/chat/thread/${threadId}/history`),

  getAgentState: (threadId: string, options: { includeMessages?: boolean } = {}) =>
    apiClient.get(
      `/api/chat/thread/${threadId}/state${options.includeMessages ? '?include_messages=true' : ''}`
    ),

  submitMessageFeedback: (messageId: number, rating: string, reason: string | null = null) =>
    apiClient.post(`/api/chat/message/${messageId}/feedback`, { rating, reason }),

  getMessageFeedback: (messageId: number) =>
    apiClient.get(`/api/chat/message/${messageId}/feedback`),

  createAgent: (payload: Record<string, unknown>) =>
    apiClient.post<{ agent: unknown }>('/api/agent', payload),

  updateAgent: (agentId: string, payload: Record<string, unknown>) =>
    apiClient.put<{ agent: unknown }>(`/api/agent/${agentId}`, payload),

  deleteAgent: (agentId: string) =>
    apiClient.delete(`/api/agent/${agentId}`),

  createAgentRun: (data: {
    query: string
    agent_slug: string
    thread_id?: string
    meta?: Record<string, unknown>
    image_content?: string | null
    model_spec?: Record<string, unknown> | null
    resume?: string | null
    created_by_run_id?: string | null
  }) =>
    apiClient.post('/api/agent/runs', {
      query: data.query,
      agent_slug: data.agent_slug,
      thread_id: data.thread_id,
      meta: data.meta || {},
      image_content: data.image_content || null,
      model_spec: data.model_spec || null,
      resume: data.resume ?? null,
      created_by_run_id: data.created_by_run_id || null
    }),

  getAgentRun: (runId: string) =>
    apiClient.get(`/api/agent/runs/${runId}`),

  cancelAgentRun: (runId: string) =>
    apiClient.post(`/api/agent/runs/${runId}/cancel`, {}),

  getThreadActiveRun: (threadId: string) =>
    apiClient.get(`/api/agent/thread/${threadId}/active_run`),

  streamAgentRunEvents: (runId: string, afterSeq = '0-0', options: { signal?: AbortSignal; verbose?: boolean } = {}) => {
    const { signal, verbose = false } = options
    const headers: Record<string, string> = {
      ...useAuthStore.getState().getAuthHeaders()
    }
    const cursor = String(afterSeq || '0-0')
    if (cursor && cursor !== '0-0') {
      headers['Last-Event-ID'] = cursor
    }
    const params = new URLSearchParams({ verbose: String(verbose) })
    return fetch(`/api/agent/runs/${runId}/events?${params.toString()}`, {
      method: 'GET',
      headers,
      signal
    })
  },

  generateTitle: async (query: string, modelSpec?: Record<string, unknown>) => {
    const response = await apiClient.post<{ response: string }>('/api/chat/call', {
      query: `根据以下对话内容生成一个简短的标题（最多30个字符，中英文均可），不要包含 markdown 标记：\n\n${query.slice(0, 2000)}`,
      meta: { model_spec: modelSpec }
    })
    return (response as { response: string }).response
  },

  simpleCall: (query: string) =>
    apiClient.post('/api/chat/call', { query })
}

export const multimodalApi = {
  uploadTmpAttachment: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/chat/attachments/tmp', formData)
  },

  parseTmpAttachment: (payload: Record<string, unknown>) =>
    apiClient.post('/api/chat/attachments/tmp/parse', payload),

  confirmTmpAttachment: (threadId: string, attachments: unknown[]) =>
    apiClient.post(`/api/chat/thread/${threadId}/attachments/confirm`, { attachments })
}