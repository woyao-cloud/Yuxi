import { useChatStream } from '../hooks/use-chat-stream'
import AgentInputArea from './agent-input-area'
import ThreadMessageList from './thread-message-list'

interface AgentChatProps {
  threadId: string | null
}

export default function AgentChat({ threadId }: AgentChatProps) {
  const { messages, isStreaming, sendMessage, stopStreaming } = useChatStream()

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">
        <ThreadMessageList messages={messages} />
      </div>
      <AgentInputArea
        onSend={(content) => sendMessage(threadId, content)}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </div>
  )
}