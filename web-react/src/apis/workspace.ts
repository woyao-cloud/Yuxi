import { apiClient } from './client'

export const workspaceApi = {
  listFiles: (path?: string) =>
    apiClient.get<{ files: unknown[] }>('/api/workspace/files', { path }),
  getFileContent: (path: string) =>
    apiClient.get<string>('/api/workspace/files/content', { path }, undefined, true, 'text'),
  getFilePreview: (path: string) =>
    apiClient.get('/api/workspace/files/preview', { path }, undefined, true, 'blob'),
  uploadFile: (path: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)
    return apiClient.post('/api/workspace/files/upload', formData)
  },
  deleteFile: (path: string) =>
    apiClient.delete('/api/workspace/files', { path }),
  createDirectory: (path: string) =>
    apiClient.post('/api/workspace/files/directory', { path })
}