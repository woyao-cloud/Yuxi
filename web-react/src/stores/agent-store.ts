import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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