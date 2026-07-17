import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient, ApiError } from '@/apis/client'

interface User {
  id: string
  username: string
  uid: string
  phone_number: string
  avatar: string
  role: string
  department_id: string | null
  department_name: string
}

interface LoginCredentials {
  loginId: string
  password: string
}

interface AuthState {
  token: string
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  getCurrentUser: () => Promise<void>
  initialize: (admin: { username: string; password: string }) => Promise<void>
  checkFirstRun: () => Promise<boolean>
  getAuthHeaders: () => Record<string, string>
}

function mapUser(data: Record<string, unknown>): User {
  return {
    id: data.id as string,
    username: data.username as string,
    uid: (data.uid as string) || '',
    phone_number: (data.phone_number as string) || '',
    avatar: (data.avatar as string) || '',
    role: data.role as string,
    department_id: (data.department_id as string | null) || null,
    department_name: (data.department_name as string) || ''
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: '',
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      isSuperAdmin: false,

      login: async (credentials) => {
        const formData = new FormData()
        formData.append('username', credentials.loginId)
        formData.append('password', credentials.password)

        try {
          const data = await apiClient.post<Record<string, unknown>>('/api/auth/token', formData, {}, false)
          const user = mapUser(data as Record<string, unknown>)
          set({
            token: data.access_token as string,
            user,
            isLoggedIn: true,
            isAdmin: user.role === 'admin' || user.role === 'superadmin',
            isSuperAdmin: user.role === 'superadmin'
          })
        } catch (err) {
          if (err instanceof ApiError && err.status === 423) {
            const error = new Error('账号已被锁定') as Error & { status: number }
            error.status = 423
            throw error
          }
          throw err
        }
      },

      logout: () => {
        set({
          token: '',
          user: null,
          isLoggedIn: false,
          isAdmin: false,
          isSuperAdmin: false
        })
      },

      getCurrentUser: async () => {
        const { token } = get()
        if (!token) return
        try {
          const userData = await apiClient.get<Record<string, unknown>>('/api/auth/me')
          const user = mapUser(userData)
          set({
            user,
            isLoggedIn: true,
            isAdmin: user.role === 'admin' || user.role === 'superadmin',
            isSuperAdmin: user.role === 'superadmin'
          })
        } catch {
          throw new Error('获取用户信息失败')
        }
      },

      initialize: async (admin) => {
        try {
          const data = await apiClient.post<Record<string, unknown>>('/api/auth/initialize', admin, {}, false)
          const user = mapUser(data as Record<string, unknown>)
          set({
            token: data.access_token as string,
            user,
            isLoggedIn: true,
            isAdmin: true,
            isSuperAdmin: user.role === 'superadmin'
          })
        } catch (err) {
          if (err instanceof ApiError) {
            throw new Error(err.message || '初始化管理员失败')
          }
          throw err
        }
      },

      checkFirstRun: async () => {
        try {
          const data = await apiClient.get<{ first_run: boolean }>('/api/auth/check-first-run', undefined, {}, false)
          return data.first_run
        } catch {
          return false
        }
      },

      getAuthHeaders: () => {
        const { token } = get()
        return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>)
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token })
    }
  )
)