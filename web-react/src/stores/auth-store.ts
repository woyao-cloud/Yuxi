import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

        const response = await fetch('/api/auth/token', { method: 'POST', body: formData })
        if (!response.ok) {
          if (response.status === 423) {
            const error = new Error('账号已被锁定') as Error & { status: number; headers: Headers }
            error.status = 423
            error.headers = response.headers
            throw error
          }
          const err = await response.json()
          throw new Error(err.detail || '登录失败')
        }

        const data = await response.json()
        const user = {
          id: data.user_id,
          username: data.username,
          uid: data.uid,
          phone_number: data.phone_number || '',
          avatar: data.avatar || '',
          role: data.role,
          department_id: data.department_id || null,
          department_name: data.department_name || ''
        }

        set({
          token: data.access_token,
          user,
          isLoggedIn: true,
          isAdmin: user.role === 'admin' || user.role === 'superadmin',
          isSuperAdmin: user.role === 'superadmin'
        })
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
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!response.ok) throw new Error('获取用户信息失败')
        const userData = await response.json()
        const user = {
          id: userData.id,
          username: userData.username,
          uid: userData.uid,
          phone_number: userData.phone_number || '',
          avatar: userData.avatar || '',
          role: userData.role,
          department_id: userData.department_id || null,
          department_name: userData.department_name || ''
        }
        set({
          user,
          isLoggedIn: true,
          isAdmin: user.role === 'admin' || user.role === 'superadmin',
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      initialize: async (admin) => {
        const response = await fetch('/api/auth/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(admin)
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.detail || '初始化管理员失败')
        }
        const data = await response.json()
        const user = {
          id: data.user_id,
          username: data.username,
          uid: data.uid,
          phone_number: data.phone_number || '',
          avatar: data.avatar || '',
          role: data.role,
          department_id: data.department_id || null,
          department_name: data.department_name || ''
        }
        set({
          token: data.access_token,
          user,
          isLoggedIn: true,
          isAdmin: true,
          isSuperAdmin: user.role === 'superadmin'
        })
      },

      checkFirstRun: async () => {
        try {
          const response = await fetch('/api/auth/check-first-run')
          const data = await response.json()
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