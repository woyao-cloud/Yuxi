import { useMemo } from 'react'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      } catch {
        // fall through
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!content) return ''
    return md.render(content)
  }, [content])

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-4 [&_code]:text-sm ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}