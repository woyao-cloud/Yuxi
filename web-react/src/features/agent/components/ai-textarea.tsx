import { useRef, useEffect, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AiTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number
}

export default function AiTextarea({ className, maxRows = 10, ...props }: AiTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const resize = () => {
      textarea.style.height = 'auto'
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20
      const maxHeight = lineHeight * maxRows
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }

    resize()
    textarea.addEventListener('input', resize)
    return () => textarea.removeEventListener('input', resize)
  }, [maxRows])

  return (
    <textarea
      ref={textareaRef}
      data-slot="ai-textarea"
      className={cn(
        'flex min-h-[60px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
        className
      )}
      {...props}
    />
  )
}