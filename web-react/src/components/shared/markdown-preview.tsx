interface MarkdownPreviewProps {
  content: string
  className?: string
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // 后续集成 markdown-it + katex + highlight.js
  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}