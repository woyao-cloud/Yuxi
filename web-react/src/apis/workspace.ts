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