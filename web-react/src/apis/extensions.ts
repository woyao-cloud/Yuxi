import { apiClient } from './client'

const MCP_BASE = '/api/system/mcp-servers'
const SKILL_BASE = '/api/system/skills'
const SKILL_USER_BASE = '/api/skills'

// =============================================================================
// MCP API
// =============================================================================

export const mcpApi = {
  getMcpServers: () => apiClient.get(MCP_BASE),

  getMcpServer: (name: string) =>
    apiClient.get(`${MCP_BASE}/${encodeURIComponent(name)}`),

  createMcpServer: (data: Record<string, unknown>) =>
    apiClient.post(MCP_BASE, data),

  updateMcpServer: (name: string, data: Record<string, unknown>) =>
    apiClient.put(`${MCP_BASE}/${encodeURIComponent(name)}`, data),

  deleteMcpServer: (name: string) =>
    apiClient.delete(`${MCP_BASE}/${encodeURIComponent(name)}`),

  testMcpConnection: (name: string) =>
    apiClient.post(`${MCP_BASE}/${encodeURIComponent(name)}/test`, {}),

  toggleMcpStatus: (name: string, enabled: boolean) =>
    apiClient.put(`${MCP_BASE}/${encodeURIComponent(name)}/status`, { enabled }),

  getMcpTools: (name: string) =>
    apiClient.get(`${MCP_BASE}/${encodeURIComponent(name)}/tools`),

  refreshMcpTools: (name: string) =>
    apiClient.post(`${MCP_BASE}/${encodeURIComponent(name)}/tools/refresh`, {}),

  toggleMcpTool: (serverName: string, toolName: string) =>
    apiClient.put(
      `${MCP_BASE}/${encodeURIComponent(serverName)}/tools/${encodeURIComponent(toolName)}/toggle`,
      {}
    )
}

// =============================================================================
// Skill API
// =============================================================================

export const skillApi = {
  listSkills: () => apiClient.get(SKILL_BASE),

  listAccessibleSkills: () => apiClient.get(`${SKILL_USER_BASE}/accessible`),

  uploadSkill: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`${SKILL_USER_BASE}/import/prepare`, formData)
  },

  listRemoteSkills: (source: string) =>
    apiClient.post(`${SKILL_USER_BASE}/remote/list`, { source }),

  prepareRemoteSkills: (payload: Record<string, unknown>) =>
    apiClient.post(`${SKILL_USER_BASE}/remote/prepare`, payload),

  searchRemoteSkills: (query: string) =>
    apiClient.post(`${SKILL_USER_BASE}/remote/search`, { query }),

  installRemoteSkill: (draftId: string, shareConfig: Record<string, unknown>) =>
    apiClient.post(`${SKILL_USER_BASE}/install-drafts/${encodeURIComponent(draftId)}/confirm`, {
      share_config: shareConfig
    }),

  installDraftSkill: (draftId: string, shareConfig: Record<string, unknown>) =>
    apiClient.post(`${SKILL_USER_BASE}/install-drafts/${encodeURIComponent(draftId)}/confirm`, {
      share_config: shareConfig
    }),

  discardSkillInstallDraft: (draftId: string) =>
    apiClient.delete(`${SKILL_USER_BASE}/install-drafts/${encodeURIComponent(draftId)}`),

  getSkillDependencyOptions: (slug?: string) => {
    const query = slug ? `?slug=${encodeURIComponent(slug)}` : ''
    return apiClient.get(`${SKILL_BASE}/dependency-options${query}`)
  },

  listBuiltinSkills: () => apiClient.get(`${SKILL_BASE}/builtin`),

  syncBuiltinSkill: () => apiClient.post(`${SKILL_BASE}/builtin/sync`),

  getSkillTree: (slug: string) =>
    apiClient.get(`${SKILL_BASE}/${encodeURIComponent(slug)}/tree`),

  getSkillFile: (slug: string, path: string) =>
    apiClient.get(`${SKILL_BASE}/${encodeURIComponent(slug)}/file?path=${encodeURIComponent(path)}`),

  createSkillFile: (slug: string, payload: Record<string, unknown>) =>
    apiClient.post(`${SKILL_BASE}/${encodeURIComponent(slug)}/file`, payload),

  updateSkillFile: (slug: string, payload: Record<string, unknown>) =>
    apiClient.put(`${SKILL_BASE}/${encodeURIComponent(slug)}/file`, payload),

  updateSkillDependencies: (slug: string, payload: Record<string, unknown>) =>
    apiClient.put(`${SKILL_BASE}/${encodeURIComponent(slug)}/dependencies`, payload),

  updateSkillShareConfig: (slug: string, shareConfig: Record<string, unknown>) =>
    apiClient.put(`${SKILL_BASE}/${encodeURIComponent(slug)}/share-config`, {
      share_config: shareConfig
    }),

  getSkillShareConfig: (slug: string) =>
    apiClient.get(`${SKILL_BASE}/${encodeURIComponent(slug)}/share-config`),

  updateSkillEnabled: (slug: string, enabled: boolean) =>
    apiClient.put(`${SKILL_BASE}/${encodeURIComponent(slug)}/enabled`, { enabled }),

  deleteSkillFile: (slug: string, path: string) =>
    apiClient.delete(`${SKILL_BASE}/${encodeURIComponent(slug)}/file?path=${encodeURIComponent(path)}`),

  exportSkill: (slug: string) =>
    apiClient.get(`${SKILL_BASE}/${encodeURIComponent(slug)}/export`, undefined, undefined, true, 'blob'),

  deleteSkill: (slug: string) =>
    apiClient.delete(`${SKILL_BASE}/${encodeURIComponent(slug)}`),

  deleteSkillBatch: (slugs: string[]) =>
    apiClient.post(`${SKILL_BASE}/delete-batch`, { slugs }),

  syncBuiltinSkills: () => apiClient.post(`${SKILL_BASE}/builtin/sync`)
}

export const extensionsApi = {
  ...mcpApi,
  ...skillApi,
  listTools: () => apiClient.get<{ tools: unknown[] }>('/api/tools')
}