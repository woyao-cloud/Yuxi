import { cn } from '@/lib/utils'
import MarkdownPreview from '@/components/shared/markdown-preview'

interface StreamChunk {
  type: string
  content: string
}

interface AgentMessageProps {
  message: StreamChunk
}

export default function AgentMessage({ message }: AgentMessageProps) {
  const isUser = message.type === 'text' && !message.content.startsWith('{')

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <MarkdownPreview content={message.content} />
      </div>
    </div>
  )
}