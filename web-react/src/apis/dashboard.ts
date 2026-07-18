import { apiClient } from './client'

export const dashboardApi = {
  getConversations: (params?: {
    uid?: string
    agent_id?: string
    status?: string
    limit?: number
    offset?: number
  }) =>
    apiClient.get('/api/dashboard/conversations', params as Record<string, unknown>),

  getConversationDetail: (threadId: string) =>
    apiClient.get(`/api/dashboard/conversations/${threadId}`),

  getFeedbacks: (params?: { rating?: string; agent_id?: string }) =>
    apiClient.get('/api/dashboard/feedbacks', params as Record<string, unknown>),

  getStats: () => apiClient.get<Record<string, unknown>>('/api/dashboard/stats'),

  getUserStats: () => apiClient.get('/api/dashboard/stats/users'),

  getToolStats: () => apiClient.get('/api/dashboard/stats/tools'),

  getKnowledgeStats: () => apiClient.get('/api/dashboard/stats/knowledge'),

  getAgentStats: (params?: Record<string, unknown>) =>
    apiClient.get('/api/dashboard/stats/agents', params),

  getAllStats: async () => {
    const [basic, users, tools, knowledge, agents] = await Promise.all([
      apiClient.get('/api/dashboard/stats'),
      apiClient.get('/api/dashboard/stats/users'),
      apiClient.get('/api/dashboard/stats/tools'),
      apiClient.get('/api/dashboard/stats/knowledge'),
      apiClient.get('/api/dashboard/stats/agents')
    ])
    return { basic, users, tools, knowledge, agents }
  },

  getCallTimeseries: (type: string = 'models', timeRange: string = '14days') =>
    apiClient.get(
      `/api/dashboard/stats/calls/timeseries?type=${type}&time_range=${timeRange}`
    )
}