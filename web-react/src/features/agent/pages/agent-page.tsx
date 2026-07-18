import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useChatStore } from '@/stores/chat-store'
import { useAgentStore } from '@/stores/agent-store'
import AgentChat from '../components/agent-chat'
import AgentSelector from '../components/agent-selector'
import PageHeader from '@/components/shared/page-header'

export default function AgentPage() {
  const { threadId } = useParams<{ threadId: string }>()
  const setCurrentThreadId = useChatStore((s) => s.setCurrentThreadId)
  const { selectedAgentId, agents, isInitialized, initialize } = useAgentStore()
  const loadThreads = useChatStore((s) => s.loadThreads)

  useEffect(() => {
    if (threadId) setCurrentThreadId(threadId)
    else setCurrentThreadId(null)
  }, [threadId, setCurrentThreadId])

  useEffect(() => {
    if (!isInitialized) initialize()
  }, [isInitialized, initialize])

  useEffect(() => {
    if (selectedAgentId) {
      loadThreads(selectedAgentId)
    }
  }, [selectedAgentId, loadThreads])

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Agent 对话"
        actions={<AgentSelector agents={agents} selectedId={selectedAgentId} />}
      />
      <div className="flex-1">
        <AgentChat agentId={selectedAgentId} threadId={threadId ?? null} />
      </div>
    </div>
  )
}