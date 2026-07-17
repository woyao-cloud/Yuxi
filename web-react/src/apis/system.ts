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