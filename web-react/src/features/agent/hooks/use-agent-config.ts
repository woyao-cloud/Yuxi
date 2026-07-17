import { useCallback } from 'react'
import { useAgentStore } from '@/stores/agent-store'

export function useAgentConfig() {
  const {
    selectedAgentId,
    agents,
    agentConfig,
    isInitialized,
    isInitializing,
    setSelectedAgentId,
    setAgents,
    setAgentConfig,
    setInitialized,
    setInitializing
  } = useAgentStore()

  const initialize = useCallback(async () => {
    if (isInitialized || isInitializing) return
    setInitializing(true)
    try {
      const response = await fetch('/api/agents')
      if (!response.ok) throw new Error('获取 Agent 列表失败')
      const data = await response.json()
      setAgents(data.agents ?? data)
      setInitialized(true)
    } catch (err) {
      console.error('Failed to initialize agents:', err)
    } finally {
      setInitializing(false)
    }
  }, [isInitialized, isInitializing, setAgents, setInitialized, setInitializing])

  return {
    selectedAgentId,
    agents,
    agentConfig,
    isInitialized,
    isInitializing,
    initialize,
    setSelectedAgentId,
    setAgents,
    setAgentConfig
  }
}