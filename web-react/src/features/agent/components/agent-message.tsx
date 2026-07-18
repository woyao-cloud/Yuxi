import { cn } from '@/lib/utils'
import MarkdownPreview from '@/components/shared/markdown-preview'
import ToolCallRenderer from '../tool-calls/tool-call-renderer'
import type { ChatMessage } from '../hooks/use-chat-stream'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface AgentMessageProps {
  message: ChatMessage
  onRetry?: () => void
}

export default function AgentMessage({ message, onRetry }: AgentMessageProps) {
  if (message.isError) {
    return (
      <div className="flex justify-start px-4">
        <div className="flex max-w-[80%] items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">消息发送失败</p>
            <p className="text-xs text-muted-foreground">{message.errorMessage}</p>
          </div>
          {onRetry && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRetry}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (message.toolCalls && message.toolCalls.length > 0) {
    return (
      <div className="space-y-2 px-4">
        {message.content && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
              <MarkdownPreview content={message.content} />
            </div>
          </div>
        )}
        {message.toolCalls.map((tc) => (
          <div key={tc.id} className="flex justify-start">
            <ToolCallRenderer
              toolCall={{ name: tc.name, args: JSON.parse(tc.args || '{}'), result: tc.result }}
              isLoading={!tc.result}
            />
          </div>
        ))}
      </div>
    )
  }

  const isUser = message.role === 'user'

  return (
    <div className={cn('flex px-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        ) : (
          <MarkdownPreview content={message.content} />
        )}
      </div>
    </div>
  )
}