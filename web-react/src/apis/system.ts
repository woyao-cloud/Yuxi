import { apiClient } from './client'

export const healthApi = {
  checkHealth: () => apiClient.get('/api/system/health', undefined, undefined, false)
}

export const configApi = {
  getConfig: () => apiClient.get<Record<string, unknown>>('/api/system/config'),
  updateConfig: (key: string, value: unknown) =>
    apiClient.post('/api/system/config', { key, value }),
  updateConfigBatch: (items: Record<string, unknown>) =>
    apiClient.post('/api/system/config/update', items),
  getLogs: (levels?: string) => {
    const url = levels
      ? `/api/system/logs?levels=${encodeURIComponent(levels)}`
      : '/api/system/logs'
    return apiClient.get(url)
  }
}

export const brandApi = {
  getInfoConfig: () => apiClient.get('/api/system/info', undefined, undefined, false)
}

export const ocrApi = {
  getOcrStatus: () => apiClient.get('/api/system/ocr/health'),
  getOcrEngines: () => apiClient.get('/api/system/ocr/engines')
}

export const modelProviderApi = {
  getProviders: () => apiClient.get('/api/system/model-providers'),

  getV2Models: (modelType: string = 'chat') =>
    apiClient.get(`/api/system/model-providers/models/v2?model_type=${modelType}`),

  refreshModelCache: () =>
    apiClient.post('/api/system/model-providers/models/cache/refresh'),

  getProviderStatus: (spec: string) =>
    apiClient.get(`/api/system/model-providers/models/status?spec=${encodeURIComponent(spec)}`),

  createProvider: (payload: Record<string, unknown>) =>
    apiClient.post('/api/system/model-providers', payload),

  updateProvider: (providerId: string, payload: Record<string, unknown>) =>
    apiClient.put(`/api/system/model-providers/${encodeURIComponent(providerId)}`, payload),

  deleteProvider: (providerId: string) =>
    apiClient.delete(`/api/system/model-providers/${encodeURIComponent(providerId)}`),

  getRemoteModels: (providerId: string) =>
    apiClient.get(`/api/system/model-providers/${encodeURIComponent(providerId)}/remote-models`)
}

export const chatModelApi = {
  getChatModels: () => apiClient.get('/api/system/chat-models'),
  getChatModelDetail: (modelId: string) =>
    apiClient.get(`/api/system/chat-models/${encodeURIComponent(modelId)}`)
}

export const systemApi = {
  getConfig: configApi.getConfig,
  updateConfig: configApi.updateConfig,
  updateConfigBatch: configApi.updateConfigBatch,
  getInfo: brandApi.getInfoConfig,
  healthCheck: healthApi.checkHealth
}