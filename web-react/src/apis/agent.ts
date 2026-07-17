import { apiClient } from './client'

export const agentApi = {
  getAgents: (params?: { includeSubagents?: boolean }) =>
    apiClient.get<{ agents: unknown[] }>('/api/agents', { params }),
  getAgentDetail: (agentId: string) =>
    apiClient.get<{ agent: unknown }>(`/api/agents/${agentId}`),
  createAgent: (payload: Record<string, unknown>) =>
    apiClient.post<{ agent: unknown }>('/api/agents', payload),
  updateAgent: (agentId: string, payload: Record<string, unknown>) =>
    apiClient.put<{ agent: unknown }>(`/api/agents/${agentId}`, payload),
  deleteAgent: (agentId: string) =>
    apiClient.delete(`/api/agents/${agentId}`)
}