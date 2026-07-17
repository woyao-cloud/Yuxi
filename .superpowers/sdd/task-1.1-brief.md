### Task 1.1：API 客户端


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
    let errorMessage = `璇锋眰澶辫触: ${response.status}`
    let errorData: ApiErrorResponse | undefined

    try {
      errorData = await response.json()
      const detail = errorData.detail
      if (detail && typeof detail === 'object') {
        errorMessage = detail.message || detail.error || errorMessage
      } else {
        errorMessage = detail || errorData.message || errorMessage
      }
    } catch {}

    const error = new ApiError(errorMessage, response.status, errorData)

    if (response.status === 401 && authStore?.isLoggedIn) {
      authStore.logout()
      setTimeout(() => { window.location.href = '/login' }, 1500)
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
  get<T>(url: string, options?: RequestInit, requiresAuth?: boolean, responseType?: 'json' | 'text' | 'blob'): Promise<T> {
    return request<T>(url, { method: 'GET', ...options }, requiresAuth, responseType)
  },
  post<T>(url: string, data?: unknown, options?: RequestInit, requiresAuth?: boolean, responseType?: 'json' | 'text' | 'blob'): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return request<T>(url, { method: 'POST', body, ...options }, requiresAuth, responseType)
  },
  put<T>(url: string, data?: unknown, options?: RequestInit, requiresAuth?: boolean, responseType?: 'json' | 'text' | 'blob'): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return request<T>(url, { method: 'PUT', body, ...options }, requiresAuth, responseType)
  },
  delete<T>(url: string, options?: RequestInit, requiresAuth?: boolean): Promise<T> {
    return request<T>(url, { method: 'DELETE', ...options }, requiresAuth)
  }
}
```

- [ ] **Step 2: 鍒涘缓 `src/apis/index.ts`**

```ts
export { apiClient, setAuthStore, ApiError } from './client'
```

- [ ] **Step 3: 鎻愪氦**

```bash
git add web-react/src/apis/
git commit -m "feat(web-react): add API client with auth and error handling"
```

---

