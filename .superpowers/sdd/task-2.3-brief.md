### Task 2.3：Agent 对话页

**Files:**
- Create: `web-react/src/features/agent/pages/agent-page.tsx`
- Create: `web-react/src/features/agent/components/agent-chat.tsx`
- Create: `web-react/src/features/agent/components/agent-message.tsx`
- Create: `web-react/src/features/agent/components/agent-input-area.tsx`
- Create: `web-react/src/features/agent/components/agent-selector.tsx`
- Create: `web-react/src/features/agent/components/thread-message-list.tsx`
- Create: `web-react/src/features/agent/components/ai-textarea.tsx`
- Create: `web-react/src/features/agent/hooks/use-chat-stream.ts`
- Create: `web-react/src/features/agent/hooks/use-agent-config.ts`

**Interfaces:**
- Consumes: `useAuthStore`, `useAgentStore`, `useChatStore`, `useChatStream` hook, `agentApi`, `knowledgeApi`
- Produces: 瀹屾暣鐨?Agent 瀵硅瘽椤甸潰

- [ ] **Step 1: 鍒涘缓 `use-chat-stream.ts` hook**锛圫SE 娴佸紡澶勭悊锛?
```ts
import { useState, useCallback, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'

interface StreamChunk {
  type: 'text' | 'tool_call' | 'tool_result' | 'error' | 'done'
  content: string
  toolCallId?: string
  toolName?: string
  toolArgs?: Record<string, unknown>
}

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [messages, setMessages] = useState<StreamChunk[]>([])
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (threadId: string | null, content: string) => {
    const abortController = new AbortController()
    abortRef.current = abortController
    setIsStreaming(true)
    setMessages([])

    const token = useAuthStore.getState().token
    const url = threadId
      ? `/api/agents/chat/${threadId}`
      : '/api/agents/chat'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: content }),
        signal: abortController.signal
      })

      if (!response.ok) throw new Error('璇锋眰澶辫触')

      const reader = response.body?.getReader()
      if (!reader) return

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n').filter((l) => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          try {
            const parsed = JSON.parse(data)
            setMessages((prev) => [...prev, parsed])
          } catch {
            setMessages((prev) => [...prev, { type: 'text', content: data }])
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) => [...prev, { type: 'error', content: (err as Error).message }])
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [])

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { isStreaming, messages, sendMessage, stopStreaming, setMessages }
}
```

- [ ] **Step 2: 鍒涘缓 `agent-page.tsx`**

```tsx
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

  useEffect(() => {
    if (threadId) setCurrentThreadId(threadId)
    else setCurrentThreadId(null)
  }, [threadId, setCurrentThreadId])

  useEffect(() => {
    if (!isInitialized) initialize()
  }, [isInitialized, initialize])

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Agent 瀵硅瘽"
        actions={<AgentSelector agents={agents} selectedId={selectedAgentId} />}
      />
      <div className="flex-1">
        <AgentChat threadId={threadId ?? null} />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 鍒涘缓 `agent-chat.tsx`**锛堟秷鎭垪琛?+ 杈撳叆鍖哄鍣級

```tsx
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
```

- [ ] **Step 4: 鍒涘缓 `agent-input-area.tsx`**

```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Square } from 'lucide-react'

interface AgentInputAreaProps {
  onSend: (content: string) => void
  onStop: () => void
  isStreaming: boolean
}

export default function AgentInputArea({ onSend, onStop, isStreaming }: AgentInputAreaProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="杈撳叆娑堟伅..."
          rows={3}
          className="resize-none"
        />
        {isStreaming ? (
          <Button variant="destructive" size="icon" onClick={onStop}>
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 鍒涘缓 `agent-selector.tsx`**

```tsx
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { useAgentStore } from '@/stores/agent-store'

interface Agent {
  id: string
  name: string
}

interface AgentSelectorProps {
  agents: Agent[]
  selectedId: string | null
}

export default function AgentSelector({ agents, selectedId }: AgentSelectorProps) {
  const setSelectedAgentId = useAgentStore((s) => s.setSelectedAgentId)

  const chatAgents = agents.filter((a) => !('is_subagent' in a))

  return (
    <Select
      value={selectedId ?? undefined}
      onValueChange={(val) => setSelectedAgentId(val)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="閫夋嫨 Agent" />
      </SelectTrigger>
      <SelectContent>
        {chatAgents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 6: 鍒涘缓 `thread-message-list.tsx`**锛堥鏋讹紝璇︾粏娓叉煋鍦ㄥ悗缁?task 涓級

```tsx
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
```

- [ ] **Step 7: 鍒涘缓 `agent-message.tsx`**锛堥鏋讹紝鏀寔 Markdown 娓叉煋锛?
```tsx
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
```

- [ ] **Step 8: 鎻愪氦**

```bash
git add web-react/src/features/agent/
git commit -m "feat(web-react): add agent chat page with streaming SSE"
```

---

