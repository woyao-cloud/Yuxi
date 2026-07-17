import { apiClient } from './client'

export const dashboardApi = {
  getStats: () => apiClient.get<Record<string, unknown>>('/api/admin/stats'),
  getAgentStats: (params?: Record<string, unknown>) =>
    apiClient.get('/api/admin/stats/agents', { params }),
  getCallStats: (params?: Record<string, unknown>) =>
    apiClient.get('/api/admin/stats/calls', { params }),
  getKnowledgeStats: () => apiClient.get('/api/admin/stats/knowledge'),
  getToolStats: () => apiClient.get('/api/admin/stats/tools'),
  getUserStats: () => apiClient.get('/api/admin/stats/users')
}