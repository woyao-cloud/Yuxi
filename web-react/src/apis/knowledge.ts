import { apiClient } from './client'

export const knowledgeApi = {
  getDatabases: () => apiClient.get<{ databases: unknown[] }>('/api/databases'),
  getAccessibleDatabases: () =>
    apiClient.get<{ databases: unknown[] }>('/api/databases/accessible'),
  getDatabaseDetail: (dbId: string) =>
    apiClient.get<{ database: unknown }>(`/api/databases/${dbId}`),
  getDocuments: (dbId: string, params?: Record<string, unknown>) =>
    apiClient.get(`/api/databases/${dbId}/documents`, params),
  getDocumentDetail: (dbId: string, docId: string) =>
    apiClient.get(`/api/databases/${dbId}/documents/${docId}`),
  query: (dbId: string, query: Record<string, unknown>) =>
    apiClient.post(`/api/databases/${dbId}/query`, query),
  getGraph: (dbId: string) =>
    apiClient.get(`/api/databases/${dbId}/graph`)
}