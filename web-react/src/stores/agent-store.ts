import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { agentApi } from '@/apis/agent'
import { knowledgeApi } from '@/apis/knowledge'
import { extensionsApi } from '@/apis/extensions'

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

interface MentionResource {
  [key: string]: unknown
}

interface AgentState {
  selectedAgentId: string | null
  agents: Agent[]
  agentConfig: Record<string, unknown>
  originalAgentConfig: Record<string, unknown>
  isInitialized: boolean
  isInitializing: boolean
  agentDetails: Record<string, Agent>
  isLoadingAgentDetail: boolean
  availableKnowledgeBases: MentionResource[]
  availableMcps: MentionResource[]
  availableSkills: MentionResource[]
  setSelectedAgentId: (id: string | null) => void
  setAgents: (agents: Agent[]) => void
  setAgentConfig: (config: Record<string, unknown>) => void
  setInitialized: (val: boolean) => void
  setInitializing: (val: boolean) => void
  initialize: () => Promise<void>
  reset: () => void
  fetchAgentDetail: (agentId: string) => Promise<Agent | null>
  selectAgent: (agentId: string) => Promise<void>
  saveAgentConfig: () => Promise<void>
  createAgent: (payload: Record<string, unknown>) => Promise<Agent | null>
  deleteAgent: (agentId: string) => Promise<void>
  fetchMentionResources: () => Promise<void>
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set, get) => ({
      selectedAgentId: null,
      agents: [],
      agentConfig: {},
      originalAgentConfig: {},
      isInitialized: false,
      isInitializing: false,
      agentDetails: {},
      isLoadingAgentDetail: false,
      availableKnowledgeBases: [],
      availableMcps: [],
      availableSkills: [],

      setSelectedAgentId: (id) => set({ selectedAgentId: id }),
      setAgents: (agents) => set({ agents }),
      setAgentConfig: (config) => set({ agentConfig: config, originalAgentConfig: { ...config } }),
      setInitialized: (val) => set({ isInitialized: val }),
      setInitializing: (val) => set({ isInitializing: val }),

      initialize: async () => {
        const state = get()
        if (state.isInitialized || state.isInitializing) return
        set({ isInitializing: true })
        try {
          const data = await agentApi.getAgents()
          const agents = (data.agents ?? []) as Agent[]
          set({ agents })

          await get().fetchMentionResources()

          const chatAgents = agents.filter((a) => !a.is_subagent)
          const targetId = get().selectedAgentId
            ? chatAgents.find((a) => a.id === get().selectedAgentId)?.id
            : null
          const preferredId = targetId || chatAgents.find((a) => a.is_builtin)?.id || chatAgents[0]?.id || null
          if (preferredId) {
            await get().selectAgent(preferredId)
          }
          set({ isInitialized: true })
        } catch (err) {
          console.error('Failed to initialize agents:', err)
        } finally {
          set({ isInitializing: false })
        }
      },

      reset: () => set({
        selectedAgentId: null,
        agents: [],
        agentConfig: {},
        originalAgentConfig: {},
        isInitialized: false,
        isInitializing: false,
        agentDetails: {},
        isLoadingAgentDetail: false,
        availableKnowledgeBases: [],
        availableMcps: [],
        availableSkills: []
      }),

      fetchAgentDetail: async (agentId: string) => {
        set({ isLoadingAgentDetail: true })
        try {
          const data = await agentApi.getAgentDetail(agentId)
          const agent = (data.agent || data) as Agent
          set((s) => ({
            agentDetails: { ...s.agentDetails, [agentId]: agent }
          }))
          return agent
        } catch (err) {
          console.error('Failed to fetch agent detail:', err)
          return null
        } finally {
          set({ isLoadingAgentDetail: false })
        }
      },

      selectAgent: async (agentId: string) => {
        set({ selectedAgentId: agentId })
        const agent = get().agentDetails[agentId] || get().agents.find((a) => a.id === agentId)
        if (agent?.config_json?.context) {
          set({
            agentConfig: { ...agent.config_json.context },
            originalAgentConfig: { ...agent.config_json.context }
          })
        }
      },

      saveAgentConfig: async () => {
        const { selectedAgentId, agentConfig } = get()
        if (!selectedAgentId) return
        try {
          await agentApi.updateAgent(selectedAgentId, { config_json: { context: agentConfig } })
          set({ originalAgentConfig: { ...agentConfig } })
        } catch (err) {
          console.error('Failed to save agent config:', err)
        }
      },

      createAgent: async (payload: Record<string, unknown>) => {
        try {
          const data = await agentApi.createAgent(payload)
          const agent = (data.agent || data) as Agent
          set((s) => ({ agents: [...s.agents, agent] }))
          return agent
        } catch (err) {
          console.error('Failed to create agent:', err)
          return null
        }
      },

      deleteAgent: async (agentId: string) => {
        try {
          await agentApi.deleteAgent(agentId)
          set((s) => ({
            agents: s.agents.filter((a) => a.id !== agentId),
            agentDetails: (() => {
              const { [agentId]: _, ...rest } = s.agentDetails
              return rest
            })()
          }))
          if (get().selectedAgentId === agentId) {
            set({ selectedAgentId: null })
          }
        } catch (err) {
          console.error('Failed to delete agent:', err)
        }
      },

      fetchMentionResources: async () => {
        try {
          const [dbsRes, mcpsRes, skillsRes] = await Promise.all([
            knowledgeApi.getAccessibleDatabases().catch(() => ({ databases: [] })),
            extensionsApi.getMcpServers().catch(() => ({ data: [] })),
            extensionsApi.listAccessibleSkills().catch(() => ({ data: [] }))
          ])
          set({
            availableKnowledgeBases: (dbsRes?.databases || []) as MentionResource[],
            availableMcps: (mcpsRes?.data || []) as MentionResource[],
            availableSkills: (skillsRes?.data || []) as MentionResource[]
          })
        } catch (err) {
          console.warn('Failed to fetch mention resources:', err)
        }
      }
    }),
    {
      name: 'agent-store',
      partialize: (state) => ({ selectedAgentId: state.selectedAgentId })
    }
  )
)