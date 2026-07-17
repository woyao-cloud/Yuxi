import { ScrollArea } from '@/components/ui/scroll-area'
import AgentMessage from './agent-message'

interface StreamChunk {
  type: string
  content: string
}

interface ThreadMessageListProps {
  messages: StreamChunk[]
}

export default function ThreadMessageList({ messages }: ThreadMessageListProps) {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <AgentMessage key={i} message={msg} />
        ))}
      </div>
    </ScrollArea>
  )
}