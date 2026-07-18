import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import AgentMessage from './agent-message'
import type { ChatMessage } from '../hooks/use-chat-stream'

interface ThreadMessageListProps {
  messages: ChatMessage[]
  onRetry?: (messageId: string) => void
}

export default function ThreadMessageList({ messages, onRetry }: ThreadMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <AgentMessage
            key={msg.id}
            message={msg}
            onRetry={onRetry ? () => onRetry(msg.id) : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}