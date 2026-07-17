import { create } from 'zustand'

interface UIState {
  settingsModalOpen: boolean
  settingsInitialTab: string
  showDebugModal: boolean
  openSettingsModal: (tab?: string) => void
  closeSettingsModal: () => void
  setShowDebugModal: (show: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  settingsModalOpen: false,
  settingsInitialTab: '',
  showDebugModal: false,
  openSettingsModal: (tab = '') => set({ settingsModalOpen: true, settingsInitialTab: tab }),
  closeSettingsModal: () => set({ settingsModalOpen: false, settingsInitialTab: '' }),
  setShowDebugModal: (show) => set({ showDebugModal: show })
}))