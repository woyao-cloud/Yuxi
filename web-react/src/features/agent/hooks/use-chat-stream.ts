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

      if (!response.ok) throw new Error('请求失败')

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