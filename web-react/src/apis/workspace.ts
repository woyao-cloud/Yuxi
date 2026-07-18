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

export const workspaceApi = {
  getTree: (path = '/', recursive = false, filesOnly = false) => {
    const query = buildQuery({ path, recursive, files_only: filesOnly })
    return apiClient.get(`/api/workspace/tree?${query}`)
  },

  getFileContent: (path: string) => {
    const query = buildQuery({ path })
    return apiClient.get(`/api/workspace/file?${query}`, undefined, undefined, true, 'blob')
  },

  getFileDownload: (path: string) => {
    const query = buildQuery({ path })
    return apiClient.get(`/api/workspace/download?${query}`, undefined, undefined, true, 'blob')
  },

  saveFileContent: (path: string, content: string) =>
    apiClient.put('/api/workspace/file', { path, content }),

  deletePath: (path: string) => {
    const query = buildQuery({ path })
    return apiClient.delete(`/api/workspace/file?${query}`)
  },

  createDirectory: (parentPath: string, name: string) =>
    apiClient.post('/api/workspace/directory', { parent_path: parentPath, name }),

  uploadFile: (parentPath: string, files: File[]) => {
    const formData = new FormData()
    formData.append('parent_path', parentPath)
    files.forEach((file) => formData.append('files', file))
    return apiClient.post('/api/workspace/upload', formData)
  },

  getKnowledgeTree: (kbId: string, params: {
    parentId?: string
    pathPrefix?: string
    page?: number
    pageSize?: number
    recursive?: boolean
    filesOnly?: boolean
  } = {}) => {
    const query = buildQuery({
      kb_id: kbId,
      parent_id: params.parentId,
      path_prefix: params.pathPrefix,
      page: params.page,
      page_size: params.pageSize,
      recursive: params.recursive || false,
      files_only: params.filesOnly || false
    })
    return apiClient.get(`/api/workspace/knowledge/tree?${query}`)
  },

  getKnowledgeFileContent: (kbId: string, fileId: string) => {
    const query = buildQuery({ kb_id: kbId, file_id: fileId })
    return apiClient.get(`/api/workspace/knowledge/file?${query}`, undefined, undefined, true, 'blob')
  },

  getKnowledgeFileDownload: (kbId: string, fileId: string, variant = 'original') => {
    const query = buildQuery({ kb_id: kbId, file_id: fileId, variant })
    return apiClient.get(`/api/workspace/knowledge/download?${query}`, undefined, undefined, true, 'blob')
  }
}