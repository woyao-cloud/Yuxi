import { create } from 'zustand'

interface TaskerState {
  isDrawerOpen: boolean
  activeCount: number
  openDrawer: () => void
  closeDrawer: () => void
}

export const useTaskerStore = create<TaskerState>()((set) => ({
  isDrawerOpen: false,
  activeCount: 0,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false })
}))