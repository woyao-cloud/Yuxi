import { create } from 'zustand'
import { systemApi } from '@/apis/system'

interface ConfigState {
  config: Record<string, unknown>
  setConfigValue: (key: string, value: unknown) => void
  refreshConfig: () => Promise<Record<string, unknown>>
}

export const useConfigStore = create<ConfigState>()((set) => ({
  config: {},

  setConfigValue: (key, value) => {
    set((s) => ({ config: { ...s.config, [key]: value } }))
    systemApi.updateConfigBatch({ [key]: value }).then((data) => {
      console.debug('Success:', data)
      set({ config: data as Record<string, unknown> })
    })
  },

  refreshConfig: async () => {
    const data = await systemApi.getConfig()
    set({ config: data })
    return data
  }
}))