import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useChatStore } from '@/stores/chat-store'
import { Search } from 'lucide-react'

export default function ConversationSearchModal() {
  const { conversationSearchOpen, setConversationSearchOpen } = useChatStore()

  return (
    <Dialog open={conversationSearchOpen} onOpenChange={setConversationSearchOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            搜索对话
          </DialogTitle>
          <DialogDescription>
            搜索功能将在后续版本中实现
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          输入关键词搜索历史对话
        </div>
      </DialogContent>
    </Dialog>
  )
}