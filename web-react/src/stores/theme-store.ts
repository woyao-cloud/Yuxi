import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggleTheme: () =>
        set((s) => {
          const next = s.mode === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { mode: next }
        }),
      setTheme: (mode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark')
        set({ mode })
      }
    }),
    { name: 'theme-store' }
  )
)