import { useChatStore } from '@/stores/chat-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from 'lucide-react'

export default function ConversationNavSection() {
  const { threads, currentThreadId, setCurrentThreadId } = useChatStore()

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 py-2">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => {
              setCurrentThreadId(thread.id)
              window.location.href = `/agent/${thread.id}`
            }}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
              currentThreadId === thread.id ? 'bg-accent font-medium' : ''
            }`}
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{thread.title || '新对话'}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}