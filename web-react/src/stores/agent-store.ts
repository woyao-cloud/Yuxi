import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { agentApi } from '@/apis/agent'

interface Agent {
  id: string
  agent_id?: string
  slug?: string
  name: string
  is_builtin?: boolean
  is_subagent?: boolean
  configurable_items?: Record<string, unknown>
  config_json?: { context?: Record<string, unknown> }
}

interface AgentState {
  selectedAgentId: string | null
  agents: Agent[]
  agentConfig: Record<string, unknown>
  originalAgentConfig: Record<string, unknown>
  isInitialized: boolean
  isInitializing: boolean
  setSelectedAgentId: (id: string | null) => void
  setAgents: (agents: Agent[]) => void
  setAgentConfig: (config: Record<string, unknown>) => void
  setInitialized: (val: boolean) => void
  setInitializing: (val: boolean) => void
  initialize: () => Promise<void>
  reset: () => void
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      selectedAgentId: null,
      agents: [],
      agentConfig: {},
      originalAgentConfig: {},
      isInitialized: false,
      isInitializing: false,

      setSelectedAgentId: (id) => set({ selectedAgentId: id }),
      setAgents: (agents) => set({ agents }),
      setAgentConfig: (config) => set({ agentConfig: config, originalAgentConfig: { ...config } }),
      setInitialized: (val) => set({ isInitialized: val }),
      setInitializing: (val) => set({ isInitializing: val }),
      initialize: async () => {
        const state = useAgentStore.getState()
        if (state.isInitialized || state.isInitializing) return
        state.setInitializing(true)
        try {
          const data = await agentApi.getAgents()
          state.setAgents((data.agents ?? []) as Agent[])
          state.setInitialized(true)
        } catch (err) {
          console.error('Failed to initialize agents:', err)
        } finally {
          state.setInitializing(false)
        }
      },
      reset: () => set({
        selectedAgentId: null,
        agents: [],
        agentConfig: {},
        originalAgentConfig: {},
        isInitialized: false,
        isInitializing: false
      })
    }),
    {
      name: 'agent-store',
      partialize: (state) => ({ selectedAgentId: state.selectedAgentId })
    }
  )
)