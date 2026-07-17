/**
 * Message processing utilities
 *
 * Migrated from Vue project's messageProcessor.js
 */

export interface ToolCallResult {
  content?: string | Record<string, unknown> | unknown[] | null
  [key: string]: unknown
}

export interface ToolCallChunk {
  index?: number
  id?: string
  name?: string
  args?: string
}

export interface ToolCall {
  id?: string
  index?: number
  name?: string
  function?: {
    name?: string
    arguments?: string
  }
  tool_call_result?: ToolCallResult | null
  [key: string]: unknown
}

export interface Message {
  type?: string
  role?: string
  content?: string | MessageContentItem[] | Record<string, unknown> | null
  tool_calls?: ToolCall[]
  tool_call_chunks?: ToolCallChunk[]
  additional_kwargs?: {
    reasoning_content?: string
    [key: string]: unknown
  }
  extra_metadata?: {
    source?: string
    [key: string]: unknown
  }
  reasoning_content?: string
  isLast?: boolean
  [key: string]: unknown
}

export interface MessageContentItem {
  type?: string
  text?: string
  [key: string]: unknown
}

export interface Conversation {
  messages: Message[]
  status?: string
}

export interface Database {
  name?: string
  [key: string]: unknown
}

export interface KnowledgeChunk {
  kb_name: string
  content: string
  score: number | null
  metadata: {
    source: string
    file_id: string
    chunk_id: string
    chunk_index?: number
  }
}

export interface WebSource {
  tool_name: string
  title: string
  url: string
  score: number | null
  content: string
  published_date: string
}

export interface SourcesResult {
  knowledgeChunks: KnowledgeChunk[]
  webSources: WebSource[]
}

export class MessageProcessor {
  /**
   * Merge tool results with messages
   */
  static convertToolResultToMessages(msgs: Message[]): Message[] {
    const toolResponseMap = new Map<string, ToolCallResult>()

    // Build tool response map
    for (const item of msgs) {
      if (item.type === 'tool') {
        const toolCallId = item.tool_call_id || item.id
        if (toolCallId) {
          toolResponseMap.set(toolCallId as string, item as unknown as ToolCallResult)
        }
      }
    }

    // Merge tool calls and responses
    const convertedMsgs = msgs.map((item: Message) => {
      if (item.type === 'ai' && item.tool_calls && item.tool_calls.length > 0) {
        return {
          ...item,
          tool_calls: item.tool_calls.map((toolCall: ToolCall) => {
            const toolResponse = toolCall.id ? toolResponseMap.get(toolCall.id) : undefined
            return {
              ...toolCall,
              tool_call_result: toolResponse ?? null
            }
          })
        }
      }
      return item
    })

    return convertedMsgs
  }

  /**
   * Convert server history to conversation format
   */
  static convertServerHistoryToMessages(serverHistory: Message[]): Conversation[] {
    // Filter out standalone 'tool' messages since tool results are already in AI messages' tool_calls
    // Backend new storage: tool results are embedded in AI messages' tool_calls array with tool_call_result field
    const filteredHistory = serverHistory.filter(
      (item: Message) =>
        item.type !== 'tool' &&
        !(item.type === 'human' && item.extra_metadata?.source === 'ask_user_question_resume')
    )

    // Group by conversation
    const conversations: Conversation[] = []
    let currentConv: Conversation | null = null

    for (const item of filteredHistory) {
      if (item.type === 'human') {
        // Start new conversation, finalize previous one
        if (currentConv) {
          // Find the last AI message and mark it as final
          for (let i = currentConv.messages.length - 1; i >= 0; i--) {
            const msg = currentConv.messages[i]!
            if (msg.type === 'ai') {
              msg.isLast = true
              currentConv.status = 'finished'
              break
            }
          }
        }
        currentConv = {
          messages: [item],
          status: 'loading'
        }
        conversations.push(currentConv)
      } else if (item.type === 'ai' && currentConv) {
        currentConv.messages.push(item)
      }
    }

    // Mark the last conversation as finished
    if (currentConv && currentConv.messages.length > 0) {
      for (let i = currentConv.messages.length - 1; i >= 0; i--) {
        const msg = currentConv.messages[i]!
        if (msg.type === 'ai') {
          msg.isLast = true
          currentConv.status = 'finished'
          break
        }
      }
    }

    return conversations
  }

  /**
   * Extract knowledge chunks from a conversation
   */
  static extractKnowledgeChunksFromConversation(
    conv: Conversation | null | undefined,
    databases: Database[] = []
  ): KnowledgeChunk[] {
    if (!conv || !Array.isArray(conv.messages) || conv.messages.length === 0) return []

    const databaseNames = new Set(
      (databases || [])
        .map((db: Database) => db?.name)
        .filter((name: string | undefined): name is string => typeof name === 'string' && name.trim() !== '')
    )
    if (databaseNames.size === 0) return []

    const normalizedChunks: KnowledgeChunk[] = []
    const dedupSet = new Set<string>()

    const appendChunk = (chunk: Record<string, unknown>, kbName: string): void => {
      if (!chunk || typeof chunk !== 'object') return
      const content = typeof chunk.content === 'string' ? chunk.content.trim() : ''
      if (!content) return

      const metadata = chunk.metadata && typeof chunk.metadata === 'object' ? (chunk.metadata as Record<string, unknown>) : {}
      const dedupKey =
        metadata.chunk_id && typeof metadata.chunk_id === 'string'
          ? `${kbName}::${metadata.chunk_id}`
          : `${kbName}::${content}`
      if (dedupSet.has(dedupKey)) return
      dedupSet.add(dedupKey)

      const score = typeof chunk.score === 'number' ? chunk.score : null
      normalizedChunks.push({
        kb_name: kbName,
        content,
        score,
        metadata: {
          source: typeof metadata.source === 'string' ? metadata.source : '',
          file_id: typeof metadata.file_id === 'string' ? metadata.file_id : '',
          chunk_id: typeof metadata.chunk_id === 'string' ? metadata.chunk_id : '',
          chunk_index: typeof metadata.chunk_index === 'number' ? metadata.chunk_index : undefined
        }
      })
    }

    const parseToolResultContent = (
      content: unknown
    ): Record<string, unknown> | unknown[] | null => {
      if (Array.isArray(content)) return content
      if (content && typeof content === 'object') return content as Record<string, unknown>
      if (typeof content === 'string') {
        try {
          return JSON.parse(content)
        } catch {
          return null
        }
      }
      return null
    }

    for (const msg of conv.messages) {
      if (!msg || msg.type !== 'ai' || !Array.isArray(msg.tool_calls)) continue

      for (const toolCall of msg.tool_calls) {
        const kbName = toolCall?.name || toolCall?.function?.name
        if (!kbName || !databaseNames.has(kbName)) continue

        const content = toolCall?.tool_call_result?.content
        const parsed = parseToolResultContent(content)
        if (!parsed) continue

        // Milvus / Dify: directly a chunks array
        if (Array.isArray(parsed)) {
          for (const chunk of parsed) {
            if (chunk && typeof chunk === 'object') {
              appendChunk(chunk as Record<string, unknown>, kbName)
            }
          }
          continue
        }

        // Wrapped format: { data: { chunks: [...] } }
        const wrappedChunks = (parsed as Record<string, unknown>)?.data as Record<string, unknown> | undefined
        const chunks = wrappedChunks?.chunks
        if (Array.isArray(chunks)) {
          for (const chunk of chunks) {
            if (chunk && typeof chunk === 'object') {
              appendChunk(chunk as Record<string, unknown>, kbName)
            }
          }
        }
      }
    }

    normalizedChunks.sort((a: KnowledgeChunk, b: KnowledgeChunk) => {
      const scoreA = typeof a.score === 'number' ? a.score : Number.NEGATIVE_INFINITY
      const scoreB = typeof b.score === 'number' ? b.score : Number.NEGATIVE_INFINITY
      return scoreB - scoreA
    })

    return normalizedChunks
  }

  /**
   * Extract web search sources from a conversation
   */
  static extractWebSourcesFromConversation(conv: Conversation | null | undefined): WebSource[] {
    if (!conv || !Array.isArray(conv.messages) || conv.messages.length === 0) return []

    const webSources: WebSource[] = []
    const dedupSet = new Set<string>()

    const parseToolResultContent = (
      content: unknown
    ): Record<string, unknown> | unknown[] | null => {
      if (Array.isArray(content)) return content
      if (content && typeof content === 'object') return content as Record<string, unknown>
      if (typeof content === 'string') {
        try {
          return JSON.parse(content)
        } catch {
          return null
        }
      }
      return null
    }

    for (const msg of conv.messages) {
      if (!msg || msg.type !== 'ai' || !Array.isArray(msg.tool_calls)) continue

      for (const toolCall of msg.tool_calls) {
        const toolName = (toolCall?.name || toolCall?.function?.name || '').toLowerCase()
        if (!toolName.includes('tavily_search')) continue

        const content = toolCall?.tool_call_result?.content
        const parsed = parseToolResultContent(content)
        const data = parsed as Record<string, unknown> | null
        const results = Array.isArray(data?.results) ? data.results : []
        if (results.length === 0) continue

        for (const item of results) {
          const itemRecord = item as Record<string, unknown>
          const title = typeof itemRecord?.title === 'string' ? itemRecord.title.trim() : ''
          const url = typeof itemRecord?.url === 'string' ? itemRecord.url.trim() : ''
          if (!title || !url) continue
          if (dedupSet.has(url)) continue
          dedupSet.add(url)

          webSources.push({
            tool_name: toolCall?.name || toolCall?.function?.name || '网络搜索',
            title,
            url,
            score: typeof itemRecord?.score === 'number' ? itemRecord.score : null,
            content: typeof itemRecord?.content === 'string' ? itemRecord.content : '',
            published_date: typeof itemRecord?.published_date === 'string' ? itemRecord.published_date : ''
          })
        }
      }
    }

    webSources.sort((a: WebSource, b: WebSource) => {
      const scoreA = typeof a.score === 'number' ? a.score : Number.NEGATIVE_INFINITY
      const scoreB = typeof b.score === 'number' ? b.score : Number.NEGATIVE_INFINITY
      return scoreB - scoreA
    })

    return webSources
  }

  /**
   * Extract sources from a single message
   */
  static extractSourcesFromMessage(
    message: Message | null | undefined,
    databases: Database[] = []
  ): SourcesResult {
    if (!message || message.type !== 'ai') return { knowledgeChunks: [], webSources: [] }

    const mockConv: Conversation = { messages: [message] }
    return {
      knowledgeChunks: MessageProcessor.extractKnowledgeChunksFromConversation(mockConv, databases),
      webSources: MessageProcessor.extractWebSourcesFromConversation(mockConv)
    }
  }

  /**
   * Extract all sources from a conversation (knowledge base + web search)
   */
  static extractSourcesFromConversation(
    conv: Conversation | null | undefined,
    databases: Database[] = []
  ): SourcesResult {
    return {
      knowledgeChunks: MessageProcessor.extractKnowledgeChunksFromConversation(conv, databases),
      webSources: MessageProcessor.extractWebSourcesFromConversation(conv)
    }
  }

  /**
   * Parse assistant message body and reasoning content
   */
  static parseAssistantMessageBody(message: Message): { content: string; reasoningContent: string } {
    let content = typeof message?.content === 'string' ? message.content.trim() : ''
    let reasoningContent = message?.additional_kwargs?.reasoning_content || ''

    if (!reasoningContent && content) {
      const thinkRegex = / thinking(.*?)<\/think>| thinking(.*?)$/gs
      const thinkMatch = content.match(thinkRegex)

      if (thinkMatch) {
        const match = thinkMatch[0]!
        // Extract the inner content of the think block
        const innerMatch = match.match(/ thinking(.*?)<\/think>/s) ?? match.match(/ thinking(.*?)$/s)
        reasoningContent = (innerMatch?.[1] || '').trim()
        content = content.replace(match, '').trim()
      }
    }

    return { content, reasoningContent }
  }

  /**
   * Merge message chunks
   */
  static mergeMessageChunk(chunks: Message[]): Message | null {
    if (chunks.length === 0) return null

    // Deep copy the first chunk as the result
    const result: Message = JSON.parse(JSON.stringify(chunks[0]!))

    // Handle user message content format - ensure plain text display
    if (result.type === 'human' || result.role === 'user') {
      // If content is an array (LangChain multimodal message), extract text
      if (Array.isArray(result.content)) {
        const textPart = (result.content as MessageContentItem[]).find(
          (item: MessageContentItem) => item.type === 'text'
        )
        result.content = textPart?.text ?? ''
      } else {
        result.content = result.content || ''
      }
    } else {
      result.content = (result.content as string) || ''
    }

    // Merge subsequent chunks
    for (let i = 1; i < chunks.length; i++) {
      const chunk = chunks[i]!

      // Merge content
      if (chunk.content) {
        result.content = (result.content as string) + chunk.content
      }

      // Merge reasoning_content
      if (chunk.reasoning_content) {
        if (!result.reasoning_content) {
          result.reasoning_content = ''
        }
        result.reasoning_content += chunk.reasoning_content
      }

      // Merge additional_kwargs reasoning_content
      if (chunk.additional_kwargs?.reasoning_content) {
        if (!result.additional_kwargs) result.additional_kwargs = {}
        if (!result.additional_kwargs.reasoning_content) {
          result.additional_kwargs.reasoning_content = ''
        }
        result.additional_kwargs.reasoning_content += chunk.additional_kwargs.reasoning_content
      }

      // Merge tool_calls
      MessageProcessor._mergeToolCalls(result, chunk)
    }

    // Handle AIMessageChunk type
    if (result.type === 'AIMessageChunk') {
      result.type = 'ai'
    }

    return result
  }

  /**
   * Merge tool calls into the result
   * @private
   */
  static _mergeToolCalls(result: Message, chunk: Message): void {
    if (chunk.tool_call_chunks && chunk.tool_call_chunks.length > 0) {
      // Ensure result has tool_calls array
      if (!result.tool_calls) result.tool_calls = []

      for (const toolCallChunk of chunk.tool_call_chunks) {
        // Use index to identify tool calls (there may be multiple)
        const existingToolCallIndex = result.tool_calls.findIndex(
          (t: ToolCall) => t.index === toolCallChunk.index
        )

        if (existingToolCallIndex !== -1) {
          // Merge same-index tool call
          const existingToolCall = result.tool_calls[existingToolCallIndex]!

          // Update name and ID if present
          if (toolCallChunk.name && !existingToolCall.function?.name) {
            if (!existingToolCall.function) existingToolCall.function = {}
            existingToolCall.function.name = toolCallChunk.name
          }

          if (toolCallChunk.id && !existingToolCall.id) {
            existingToolCall.id = toolCallChunk.id
          }

          // Merge arguments
          if (toolCallChunk.args) {
            if (!existingToolCall.function) existingToolCall.function = {}
            if (!existingToolCall.function.arguments) existingToolCall.function.arguments = ''
            existingToolCall.function.arguments += toolCallChunk.args
          }
        } else {
          // Add new tool call
          const newToolCall: ToolCall = {
            index: toolCallChunk.index,
            id: toolCallChunk.id,
            function: {
              name: toolCallChunk.name || null as unknown as string,
              arguments: toolCallChunk.args || ''
            }
          }
          result.tool_calls.push(newToolCall)
        }
      }
    }
  }
}

export default MessageProcessor