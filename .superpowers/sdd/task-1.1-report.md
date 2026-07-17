# Task 1.1: API Client - Report

## What was created

- `web-react/src/apis/client.ts` - HTTP client with:
  - `ApiErrorResponse` interface for standardized error response shape
  - `ApiError` class extending `Error` with `status` and `data` properties
  - `AuthStore` interface defining the expected auth store shape (`token`, `isLoggedIn`, `logout`)
  - `setAuthStore()` function to inject the Zustand auth store (store created in Task 1.2)
  - `request<T>()` core function with:
    - Automatic `Content-Type: application/json` header (skipped for FormData)
    - Bearer token injection when `requiresAuth` is true and user is logged in
    - Structured error extraction from `detail` field (supports both string and object shapes)
    - 401 auto-logout: calls `authStore.logout()` then redirects to `/login` after 1.5s
    - Response type handling: `json`, `text`, `blob`
  - `apiClient` object with `get`, `post`, `put`, `delete` methods

- `web-react/src/apis/index.ts` - Barrel export of `apiClient`, `setAuthStore`, `ApiError`

## Test results

- `pnpm lint` -- PASS (no output, no errors)
- `pnpm tsc --noEmit` -- PASS (no output, no errors)

## Files changed

- `web-react/src/apis/client.ts` (created)
- `web-react/src/apis/index.ts` (created)