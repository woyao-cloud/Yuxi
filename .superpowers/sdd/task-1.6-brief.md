### Task 1.6：API 模块


**Files:**
- Create: `web-react/src/apis/auth.ts`
- Create: `web-react/src/apis/agent.ts`
- Create: `web-react/src/apis/knowledge.ts`
- Create: `web-react/src/apis/workspace.ts`
- Create: `web-react/src/apis/extensions.ts`
- Create: `web-react/src/apis/dashboard.ts`
- Create: `web-react/src/apis/system.ts`
- Create: `web-react/src/apis/user.ts`

**Interfaces:**
- Consumes: Task 1.1 鐨?`apiClient`
- Produces: 灏佽鎵€鏈夊悗绔?API 璋冪敤鐨勫嚱鏁?
- [ ] **Step 1: 鍒涘缓 `src/apis/auth.ts`**

```ts
import { apiClient } from './client'

export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    apiClient.post<{ access_token: string; user_id: string; username: string; role: string }>(
      '/api/auth/token',
      new URLSearchParams(credentials).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      false
    ),
  getMe: () => apiClient.get<Record<string, unknown>>('/api/auth/me'),
  getUsers: (params?: { skip?: number; limit?: number }) =>
    apiClient.get<unknown[]>('/api/auth/users', {
      params: new URLSearchParams(params as Record<string, string>)
    }),
  createUser: (data: Record<string, unknown>) =>
    apiClient.post('/api/auth/users', data),
  updateUser: (userId: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/auth/users/${userId}`, data),
  deleteUser: (userId: string) =>
    apiClient.delete(`/api/auth/users/${userId}`),
  updateProfile: (data: Record<string, unknown>) =>
    apiClient.put('/api/auth/profile', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/auth/upload-avatar', formData)
  },
  checkFirstRun: () =>
    apiClient.get<{ first_run: boolean }>('/api/auth/check-first-run', {}, false),
  initialize: (admin: { username: string; password: string }) =>
    apiClient.post('/api/auth/initialize', admin, {}, false),
  validateUsername: (username: string) =>
    apiClient.post('/api/auth/validate-username', { username })
}
```

- [ ] **Step 2: 鍒涘缓 `src/apis/agent.ts`**

```ts
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
```

- [ ] **Step 3: 鍒涘缓 `src/apis/knowledge.ts`**

```ts
import { apiClient } from './client'

export const knowledgeApi = {
  getDatabases: () => apiClient.get<{ databases: unknown[] }>('/api/databases'),
  getAccessibleDatabases: () =>
    apiClient.get<{ databases: unknown[] }>('/api/databases/accessible'),
  getDatabaseDetail: (dbId: string) =>
    apiClient.get<{ database: unknown }>(`/api/databases/${dbId}`),
  getDocuments: (dbId: string, params?: Record<string, unknown>) =>
    apiClient.get(`/api/databases/${dbId}/documents`, { params }),
  getDocumentDetail: (dbId: string, docId: string) =>
    apiClient.get(`/api/databases/${dbId}/documents/${docId}`),
  query: (dbId: string, query: Record<string, unknown>) =>
    apiClient.post(`/api/databases/${dbId}/query`, query),
  getGraph: (dbId: string) =>
    apiClient.get(`/api/databases/${dbId}/graph`)
}
```

- [ ] **Step 4: 鍒涘缓 `src/apis/workspace.ts`**

```ts
import { apiClient } from './client'

export const workspaceApi = {
  listFiles: (path?: string) =>
    apiClient.get<{ files: unknown[] }>('/api/workspace/files', { params: { path } }),
  getFileContent: (path: string) =>
    apiClient.get<string>('/api/workspace/files/content', { params: { path } }, true, 'text'),
  getFilePreview: (path: string) =>
    apiClient.get('/api/workspace/files/preview', { params: { path } }, true, 'blob'),
  uploadFile: (path: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)
    return apiClient.post('/api/workspace/files/upload', formData)
  },
  deleteFile: (path: string) =>
    apiClient.delete('/api/workspace/files', { params: { path } }),
  createDirectory: (path: string) =>
    apiClient.post('/api/workspace/files/directory', { path })
}
```

- [ ] **Step 5: 鍒涘缓 `src/apis/extensions.ts`**

```ts
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
```

- [ ] **Step 6: 鍒涘缓 `src/apis/dashboard.ts`**

```ts
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
```

- [ ] **Step 7: 鍒涘缓 `src/apis/system.ts`**

```ts
import { apiClient } from './client'

export const systemApi = {
  getConfig: () => apiClient.get<Record<string, unknown>>('/api/system/config'),
  updateConfig: (key: string, value: unknown) =>
    apiClient.put('/api/system/config', { key, value }),
  updateConfigBatch: (config: Record<string, unknown>) =>
    apiClient.put('/api/system/config/batch', config),
  getInfo: () => apiClient.get<Record<string, unknown>>('/api/system/info'),
  healthCheck: () => apiClient.get<{ status: string }>('/api/health', {}, false)
}
```

- [ ] **Step 8: 鍒涘缓 `src/apis/user.ts`**

```ts
import { apiClient } from './client'

export const userApi = {
  getUserConfig: () => apiClient.get<Record<string, unknown>>('/api/user/config'),
  updateUserConfig: (config: Record<string, unknown>) =>
    apiClient.put('/api/user/config', config),
  getDepartments: () => apiClient.get<{ departments: unknown[] }>('/api/departments'),
  createDepartment: (data: Record<string, unknown>) =>
    apiClient.post('/api/departments', data),
  updateDepartment: (deptId: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/departments/${deptId}`, data),
  deleteDepartment: (deptId: string) =>
    apiClient.delete(`/api/departments/${deptId}`)
}
```

- [ ] **Step 9: 鏇存柊 `src/apis/index.ts` 瀵煎嚭鎵€鏈夋ā鍧?*

```ts
export { apiClient, setAuthStore, ApiError } from './client'
export { authApi } from './auth'
export { agentApi } from './agent'
export { knowledgeApi } from './knowledge'
export { workspaceApi } from './workspace'
export { extensionsApi } from './extensions'
export { dashboardApi } from './dashboard'
export { systemApi } from './system'
export { userApi } from './user'
```

- [ ] **Step 10: 鎻愪氦**

```bash
git add web-react/src/apis/
git commit -m "feat(web-react): add all API modules"
```

---

## 闃舵 2锛氭牳蹇冨姛鑳芥ā鍧?
