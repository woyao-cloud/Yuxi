import { cn } from '@/lib/utils'
import MarkdownPreview from '@/components/shared/markdown-preview'
import ToolCallRenderer from '../tool-calls/tool-call-renderer'

interface StreamChunk {
  type: string
  content: string
  toolCallId?: string
  toolName?: string
  toolArgs?: string | Record<string, unknown>
  toolResult?: unknown
}

interface AgentMessageProps {
  message: StreamChunk
}

export default function AgentMessage({ message }: AgentMessageProps) {
  if (message.type === 'tool_call' || message.type === 'tool_result') {
    return (
      <div className="flex justify-start px-4">
        <ToolCallRenderer
          toolCall={{
            name: message.toolName ?? 'unknown',
            args: typeof message.toolArgs === 'string' ? JSON.parse(message.toolArgs) : (message.toolArgs ?? {}),
            result: message.toolResult
          }}
        />
      </div>
    )
  }

  const isUser = message.type === 'text' && !message.content.startsWith('{')

  return (
    <div className={cn('flex px-4', isUser ? 'justify-end' : 'justify-start')}>
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