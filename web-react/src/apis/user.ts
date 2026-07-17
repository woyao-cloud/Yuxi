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