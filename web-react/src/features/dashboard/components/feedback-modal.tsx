import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquareText } from 'lucide-react'

interface FeedbackModalProps {
  onSubmit?: (content: string) => void
}

export default function FeedbackModal({ onSubmit }: FeedbackModalProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      await onSubmit?.(content.trim())
      setContent('')
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <MessageSquareText className="mr-1 h-4 w-4" />
          反馈
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>意见反馈</DialogTitle>
          <DialogDescription>
            请描述您的建议或遇到的问题，我们将尽快处理。
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="请输入反馈内容..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
        />
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
          >
            {submitting ? '提交中...' : '提交反馈'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}