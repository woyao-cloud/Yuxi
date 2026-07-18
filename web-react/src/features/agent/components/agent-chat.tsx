import { useChatStream } from '../hooks/use-chat-stream'
import AgentInputArea from './agent-input-area'
import ThreadMessageList from './thread-message-list'

interface AgentChatProps {
  agentId: string | null
  threadId: string | null
}

export default function AgentChat({ agentId, threadId }: AgentChatProps) {
  const { messages, isStreaming, sendMessage, stopStreaming } = useChatStream({ agentId, threadId })

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <ThreadMessageList messages={messages} />
      </div>
      <AgentInputArea onSend={sendMessage} onStop={stopStreaming} isStreaming={isStreaming} />
    </div>
  )
}