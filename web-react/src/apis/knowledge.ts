import { apiClient } from './client'

const buildQuery = (params: Record<string, unknown>) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value))
    }
  })
  return query.toString()
}

// =============================================================================
// Database API
// =============================================================================

export const databaseApi = {
  getDatabases: () => apiClient.get<{ databases: unknown[] }>('/api/knowledge/databases'),

  getAccessibleDatabases: () => apiClient.get('/api/knowledge/databases/accessible'),

  getDatabaseDetail: (kbId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}`),

  createDatabase: (data: Record<string, unknown>) =>
    apiClient.post('/api/knowledge/databases', data),

  updateDatabase: (kbId: string, data: Record<string, unknown>) =>
    apiClient.put(`/api/knowledge/databases/${kbId}`, data),

  deleteDatabase: (kbId: string) =>
    apiClient.delete(`/api/knowledge/databases/${kbId}`),

  repairDatabaseStats: (kbId: string) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/stats/repair`, {}),

  generateDescription: (name: string, currentDescription = '', fileList: string[] = []) =>
    apiClient.post('/api/knowledge/generate-description', {
      name,
      current_description: currentDescription,
      file_list: fileList
    })
}

// =============================================================================
// Document API
// =============================================================================

export const documentApi = {
  listDocuments: (kbId: string, params: Record<string, unknown> = {}) => {
    const query = buildQuery(params)
    return apiClient.get(
      `/api/knowledge/databases/${kbId}/documents${query ? `?${query}` : ''}`
    )
  },

  documentExists: (kbId: string, filename: string) => {
    const query = buildQuery({ filename })
    return apiClient.get(`/api/knowledge/databases/${kbId}/documents/exists?${query}`)
  },

  createFolder: (kbId: string, folderName: string, parentId: string | null = null) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/folders`, {
      folder_name: folderName,
      parent_id: parentId
    }),

  addDocuments: (kbId: string, items: unknown[], params: Record<string, unknown> = {}) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/documents`, {
      items,
      params
    }),

  addUploadedDocuments: (kbId: string, items: unknown[], params: Record<string, unknown> = {}) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/documents/add`, {
      items,
      params
    }),

  getDocumentDetail: (kbId: string, docId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/documents/${docId}`),

  getDocumentBasicInfo: (kbId: string, docId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/documents/${docId}/basic`),

  getDocumentContent: (kbId: string, docId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/documents/${docId}/content`),

  deleteDocument: (kbId: string, docId: string) =>
    apiClient.delete(`/api/knowledge/databases/${kbId}/documents/${docId}`),

  batchDeleteDocuments: (kbId: string, fileIds: string[]) =>
    apiClient.delete(
      `/api/knowledge/databases/${kbId}/documents/batch`,
      undefined,
      {
        body: JSON.stringify(fileIds),
        headers: { 'Content-Type': 'application/json' }
      }
    ),

  downloadDocument: (kbId: string, docId: string) =>
    apiClient.get(
      `/api/knowledge/databases/${kbId}/documents/${docId}/download`,
      undefined,
      undefined,
      true,
      'blob'
    ),

  parseDocuments: (kbId: string, fileIds: string[]) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/documents/parse`, fileIds),

  parsePendingDocuments: (kbId: string) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/documents/parse-pending`, {}),

  indexDocuments: (kbId: string, fileIds: string[], params: Record<string, unknown> = {}) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/documents/index`, {
      file_ids: fileIds,
      params
    }),

  indexPendingDocuments: (kbId: string, params: Record<string, unknown> = {}) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/documents/index-pending`, { params })
}

// =============================================================================
// Graph Build API
// =============================================================================

export const graphBuildApi = {
  getStatus: (kbId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/graph-build/status`),

  configure: (kbId: string, data: Record<string, unknown>) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/graph-build/config`, data),

  startIndex: (kbId: string, batchSize = 20) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/graph-build/index`, {
      batch_size: batchSize
    }),

  reset: (kbId: string, data: Record<string, unknown>) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/graph-build/reset`, data)
}

// =============================================================================
// Mindmap API
// =============================================================================

export const mindmapApi = {
  getDatabases: () => apiClient.get('/api/knowledge/mindmap/databases'),

  getDatabaseFiles: (kbId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/mindmap/files`),

  generateMindmap: (kbId: string, fileIds: string[] = [], userPrompt = '', incremental = false) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/mindmap/generate`, {
      file_ids: fileIds,
      user_prompt: userPrompt,
      incremental
    }),

  getByDatabase: (kbId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/mindmap`),

  getDiff: (kbId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/mindmap/diff`)
}

// =============================================================================
// Query API
// =============================================================================

export const queryApi = {
  queryKnowledgeBase: (kbId: string, query: string, meta: Record<string, unknown> = {}) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/query`, { query, meta }),

  queryTest: (kbId: string, query: string, meta: Record<string, unknown> = {}) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/query-test`, { query, meta }),

  getQueryParams: (kbId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/query-params`),

  updateQueryParams: (kbId: string, params: Record<string, unknown>) =>
    apiClient.put(`/api/knowledge/databases/${kbId}/query-params`, params),

  generateSampleQuestions: (kbId: string, count = 10) =>
    apiClient.post(`/api/knowledge/databases/${kbId}/sample-questions`, { count }),

  getSampleQuestions: (kbId: string) =>
    apiClient.get(`/api/knowledge/databases/${kbId}/sample-questions`)
}

// =============================================================================
// File API
// =============================================================================

export const fileApi = {
  fetchUrl: (url: string, kbId: string | null = null) =>
    apiClient.post('/api/knowledge/files/fetch-url', { url, kb_id: kbId }),

  importWorkspaceFiles: (kbId: string, paths: string[]) =>
    apiClient.post('/api/knowledge/files/import-workspace', { kb_id: kbId, paths }),

  uploadFile: (file: File, kbId: string | null = null) => {
    const formData = new FormData()
    formData.append('file', file)
    const url = kbId
      ? `/api/knowledge/files/upload?kb_id=${kbId}`
      : '/api/knowledge/files/upload'
    return apiClient.post(url, formData)
  },

  getSupportedFileTypes: () => apiClient.get('/api/knowledge/files/supported-types'),

  uploadFolder: (file: File, kbId: string) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/api/knowledge/files/upload-folder?kb_id=${kbId}`, formData)
  },

  processFolder: (data: { file_path: string; kb_id: string; content_hash: string }) =>
    apiClient.post('/api/knowledge/files/process-folder', data)
}

// =============================================================================
// Type API
// =============================================================================

export const typeApi = {
  getKnowledgeBaseTypes: () => apiClient.get('/api/knowledge/types'),

  getChunkPresets: () => apiClient.get('/api/knowledge/chunk-presets'),

  getStatistics: () => apiClient.get('/api/knowledge/stats')
}

// =============================================================================
// Evaluation API
// =============================================================================

export const evaluationApi = {
  uploadDataset: (kbId: string, file: File, metadata: Record<string, unknown> = {}) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', (metadata.name as string) || '')
    formData.append('description', (metadata.description as string) || '')
    return apiClient.post(`/api/evaluation/databases/${kbId}/datasets/upload`, formData)
  },

  listDatasets: (kbId: string) =>
    apiClient.get(`/api/evaluation/databases/${kbId}/datasets`),

  getDataset: (kbId: string, datasetId: string, page = 1, pageSize = 50) => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString()
    })
    return apiClient.get(`/api/evaluation/databases/${kbId}/datasets/${datasetId}?${params}`)
  },

  deleteDataset: (datasetId: string) =>
    apiClient.delete(`/api/evaluation/datasets/${datasetId}`),

  downloadDataset: (datasetId: string) =>
    apiClient.get(
      `/api/evaluation/datasets/${datasetId}/download`,
      undefined,
      undefined,
      true,
      'blob'
    ),

  generateDataset: (kbId: string, params: Record<string, unknown>) =>
    apiClient.post(`/api/evaluation/databases/${kbId}/datasets/generate`, params),

  listEvaluations: (kbId: string) =>
    apiClient.get(`/api/evaluation/databases/${kbId}/runs`),

  createEvaluation: (kbId: string, params: Record<string, unknown>) =>
    apiClient.post(`/api/evaluation/databases/${kbId}/runs`, params),

  getEvaluation: (kbId: string, runId: string, params: Record<string, unknown> = {}) => {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.append('page', String(params.page))
    if (params.pageSize) queryParams.append('page_size', String(params.pageSize))
    if (params.errorOnly !== undefined) queryParams.append('error_only', String(params.errorOnly))
    const url = `/api/evaluation/databases/${kbId}/runs/${runId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    return apiClient.get(url)
  },

  deleteEvaluation: (kbId: string, runId: string) =>
    apiClient.delete(`/api/evaluation/databases/${kbId}/runs/${runId}`),

  getBenchmark: (benchmarkId: string) =>
    apiClient.get(`/api/evaluation/benchmarks/${benchmarkId}`),

  listBenchmarks: () => apiClient.get('/api/evaluation/benchmarks')
}

// Keep legacy knowledgeApi for backward compatibility
export const knowledgeApi = {
  getDatabases: databaseApi.getDatabases,
  getAccessibleDatabases: databaseApi.getAccessibleDatabases,
  getDatabaseDetail: databaseApi.getDatabaseDetail,
  getDocuments: documentApi.listDocuments,
  getDocumentDetail: documentApi.getDocumentDetail,
  query: queryApi.queryKnowledgeBase,
  getGraph: graphBuildApi.getStatus
}