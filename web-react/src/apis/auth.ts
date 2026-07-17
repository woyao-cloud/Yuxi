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
    apiClient.get<unknown[]>('/api/auth/users', new URLSearchParams(params as Record<string, string>)),
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
    apiClient.get<{ first_run: boolean }>('/api/auth/check-first-run', undefined, {}, false),
  initialize: (admin: { username: string; password: string }) =>
    apiClient.post('/api/auth/initialize', admin, {}, false),
  validateUsername: (username: string) =>
    apiClient.post('/api/auth/validate-username', { username })
}