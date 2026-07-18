import { useState, useCallback, useRef } from 'react'
import { agentApi } from '@/apis/agent'

export interface ToolCall {
  id: string
  name: string
  args: string
  result?: unknown
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  toolCalls?: ToolCall[]
  isStreaming?: boolean
  isError?: boolean
  errorMessage?: string
  modelName?: string
}

interface UseChatStreamOptions {
  agentId: string | null
  threadId: string | null
}

function parseSSEChunk(
  chunk: Record<string, unknown>,
  _assistantMsgId: string,
  updateAssistant: (fn: (msg: ChatMessage) => ChatMessage) => void
) {
  const status = chunk.status as string | undefined
  const msg = chunk.msg as Record<string, unknown> | undefined

  switch (status) {
    case 'loading': {
      if (msg?.type === 'AIMessageChunk' && typeof msg.content === 'string' && msg.content) {
        updateAssistant((m) => ({ ...m, content: m.content + (msg.content as string) }))
      }
      if (Array.isArray(msg?.tool_call_chunks)) {
        for (const tc of msg.tool_call_chunks as Array<Record<string, unknown>>) {
          updateAssistant((m) => {
            const existing = m.toolCalls || []
            const idx = existing.findIndex((t) => t.id === tc.id)
            if (idx >= 0) {
              const updated = [...existing]
              const current = updated[idx]
              if (current) {
                updated[idx] = {
                  ...current,
                  args: current.args + (typeof tc.args === 'string' ? tc.args : '')
                }
              }
              return { ...m, toolCalls: updated }
            }
            return {
              ...m,
              toolCalls: [
                ...existing,
                {
                  id: (tc.id as string) || `tool-${Date.now()}`,
                  name: (tc.name as string) || 'unknown',
                  args: typeof tc.args === 'string' ? tc.args : ''
                }
              ]
            }
          })
        }
      }
      break
    }
    case 'stream_event': {
      const streamEvent = chunk.event as Record<string, unknown> | undefined
      const toolOutput = streamEvent?.data as Record<string, unknown> | undefined
      if (toolOutput?.event === 'tool-finished' && toolOutput.output) {
        const output = toolOutput.output as Record<string, unknown>
        const toolId = (output.id || output.tool_call_id) as string | undefined
        if (toolId) {
          updateAssistant((m) => ({
            ...m,
            toolCalls: (m.toolCalls || []).map((tc) =>
              tc.id === toolId ? { ...tc, result: output.content || output } : tc
            )
          }))
        }
      }
      break
    }
    case 'error': {
      const errMsg = (chunk.message as string) || (msg?.content as string) || 'Stream error'
      updateAssistant((m) => ({ ...m, isStreaming: false, isError: true, errorMessage: errMsg }))
      break
    }
    case 'finished':
    case 'interrupted':
      updateAssistant((m) => ({ ...m, isStreaming: false }))
      break
  }
}

export function useChatStream({ agentId, threadId }: UseChatStreamOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const currentRunIdRef = useRef<string | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!agentId || !content.trim()) return

      const abortController = new AbortController()
      abortRef.current = abortController
      setIsStreaming(true)

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content
      }
      const assistantMsgId = `assistant-${Date.now()}`
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        isStreaming: true
      }
      setMessages((prev) => [...prev, userMsg, assistantMsg])

      const updateAssistant = (fn: (msg: ChatMessage) => ChatMessage) => {
        setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? fn(m) : m)))
      }

      try {
        const runRes = await agentApi.createAgentRun({
          query: content,
          agent_slug: agentId,
          thread_id: threadId ?? undefined,
          meta: {}
        })
        const runId = ((runRes as Record<string, unknown>).run_id ||
          (runRes as Record<string, unknown>).id) as string
        currentRunIdRef.current = runId

        const response = await agentApi.streamAgentRunEvents(runId, '0-0', {
          signal: abortController.signal,
          verbose: true
        })

        if (!response.ok) throw new Error(`Stream request failed: ${response.status}`)

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''
        let eventType = 'message'
        let dataLines: string[] = []

        const dispatch = () => {
          if (dataLines.length === 0) return
          try {
            const data = JSON.parse(dataLines.join('\n'))
            if (eventType === 'end' || eventType === 'error') {
              parseSSEChunk({ ...data, status: eventType }, assistantMsgId, updateAssistant)
            } else {
              const items = data?.payload?.items
              if (Array.isArray(items)) {
                for (const chunk of items) {
                  parseSSEChunk(chunk as Record<string, unknown>, assistantMsgId, updateAssistant)
                }
              } else if (data?.payload?.chunk) {
                parseSSEChunk(
                  data.payload.chunk as Record<string, unknown>,
                  assistantMsgId,
                  updateAssistant
                )
              } else if (data?.status) {
                parseSSEChunk(data as Record<string, unknown>, assistantMsgId, updateAssistant)
              }
            }
          } catch {
            // skip unparseable events
          }
        }

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const rawLine of lines) {
            const line = rawLine.replace(/\r$/, '')
            if (!line) {
              dispatch()
              eventType = 'message'
              dataLines = []
              continue
            }
            if (line.startsWith(':')) continue
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim() || 'message'
            } else if (line.startsWith('data:')) {
              dataLines.push(line.slice(5).trimStart())
            }
          }
        }
        dispatch()

        updateAssistant((m) => ({ ...m, isStreaming: false }))
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          updateAssistant((m) => ({
            ...m,
            isStreaming: false,
            isError: true,
            errorMessage: (err as Error).message
          }))
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [agentId, threadId]
  )

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    if (currentRunIdRef.current) {
      agentApi.cancelAgentRun(currentRunIdRef.current).catch(() => {})
    }
  }, [])

  return { messages, isStreaming, sendMessage, stopStreaming, setMessages }
}