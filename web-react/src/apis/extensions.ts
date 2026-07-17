import { apiClient } from './client'

export const extensionsApi = {
  // MCP
  getMcpServers: () => apiClient.get<{ data: unknown[] }>('/api/mcp/servers'),
  getMcpServerDetail: (slug: string) => apiClient.get(`/api/mcp/servers/${slug}`),
  createMcpServer: (data: Record<string, unknown>) =>
    apiClient.post('/api/mcp/servers', data),
  updateMcpServer: (slug: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/mcp/servers/${slug}`, data),
  deleteMcpServer: (slug: string) =>
    apiClient.delete(`/api/mcp/servers/${slug}`),

  // Skill
  listSkills: () => apiClient.get<{ data: unknown[] }>('/api/skills'),
  listAccessibleSkills: () => apiClient.get<{ data: unknown[] }>('/api/skills/accessible'),
  getSkillDetail: (slug: string) => apiClient.get(`/api/skills/${slug}`),

  // Tools
  listTools: () => apiClient.get<{ tools: unknown[] }>('/api/tools')
}