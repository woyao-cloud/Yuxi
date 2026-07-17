/* eslint-disable @typescript-eslint/no-explicit-any */

interface ApiErrorResponse {
  detail?: string | { message?: string; error?: string }
  message?: string
}

export class ApiError extends Error {
  status: number
  data: ApiErrorResponse | undefined

  constructor(message: string, status: number, data?: ApiErrorResponse) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

interface AuthStore {
  token: string
  isLoggedIn: boolean
  logout: () => void
}

let authStore: AuthStore | null = null

export function setAuthStore(store: AuthStore) {
  authStore = store
}

async function request<T>(
  url: string,
  options: RequestInit = {},
  requiresAuth = true,
  responseType: 'json' | 'text' | 'blob' = 'json'
): Promise<T> {
  const isFormData = options.body instanceof FormData
  const headers: Record<string, string> = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers as Record<string, string>)
  }

  if (requiresAuth && authStore?.isLoggedIn) {
    headers.Authorization = `Bearer ${authStore.token}`
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    let errorMessage = `请求失败: ${response.status}`
    let errorData: ApiErrorResponse | undefined

    try {
      errorData = await response.json()
      const detail = errorData.detail
      if (detail && typeof detail === 'object') {
        errorMessage = detail.message || detail.error || errorMessage
      } else {
        errorMessage = detail || errorData.message || errorMessage
      }
    } catch {
      // ignore JSON parse errors, use default error message
    }

    const error = new ApiError(errorMessage, response.status, errorData)

    if (response.status === 401 && authStore?.isLoggedIn) {
      authStore.logout()
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    }

    throw error
  }

  if (responseType === 'blob') return response as unknown as T
  if (responseType === 'text') return response.text() as Promise<T>

  const contentType = response.headers.get('Content-Type')
  if (contentType?.includes('application/json')) {
    return response.json()
  }
  return response.text() as Promise<T>
}

export const apiClient = {
  get<T>(
    url: string,
    options?: RequestInit,
    requiresAuth?: boolean,
    responseType?: 'json' | 'text' | 'blob'
  ): Promise<T> {
    return request<T>(url, { method: 'GET', ...options }, requiresAuth, responseType)
  },
  post<T>(
    url: string,
    data?: unknown,
    options?: RequestInit,
    requiresAuth?: boolean,
    responseType?: 'json' | 'text' | 'blob'
  ): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return request<T>(url, { method: 'POST', body, ...options }, requiresAuth, responseType)
  },
  put<T>(
    url: string,
    data?: unknown,
    options?: RequestInit,
    requiresAuth?: boolean,
    responseType?: 'json' | 'text' | 'blob'
  ): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return request<T>(url, { method: 'PUT', body, ...options }, requiresAuth, responseType)
  },
  delete<T>(
    url: string,
    options?: RequestInit,
    requiresAuth?: boolean
  ): Promise<T> {
    return request<T>(url, { method: 'DELETE', ...options }, requiresAuth)
  }
}