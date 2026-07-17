### Task 2.4：Agent 消息完整渲染 (ToolCall)

**Files:**
- Create: `web-react/src/features/agent/tool-calls/tool-registry.ts`
- Create: `web-react/src/features/agent/tool-calls/base-tool-call.tsx`
- Create: `web-react/src/features/agent/tool-calls/tool-call-renderer.tsx`
- Create: 鎵€鏈?tool 娓叉煋缁勪欢锛?0+ 涓級
- Modify: `web-react/src/features/agent/components/agent-message.tsx`

**Interfaces:**
- Consumes: 鍚?tool 娓叉煋缁勪欢
- Produces: 瀹屾暣鐨勬秷鎭覆鏌撶绾?
- [ ] **Step 1: 鍒涘缓 `tool-registry.ts`**

```ts
import type { ComponentType } from 'react'

interface ToolCallProps {
  args: Record<string, unknown>
  result?: unknown
  isLoading?: boolean
}

type ToolComponent = ComponentType<ToolCallProps>

const toolMap = new Map<string, ToolComponent>()

export function registerTool(name: string, component: ToolComponent) {
  toolMap.set(name, component)
}

export function getToolComponent(name: string): ToolComponent | undefined {
  return toolMap.get(name)
}

export { type ToolCallProps }
```

- [ ] **Step 2: 鍒涘缓 `base-tool-call.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface BaseToolCallProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  isLoading?: boolean
}

export default function BaseToolCall({ title, icon, children, isLoading }: BaseToolCallProps) {
  return (
    <Card className="my-2">
      <CardHeader className="py-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">{children}</CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: 鍒涘缓 `tool-call-renderer.tsx`**

```tsx
import { getToolComponent } from './tool-registry'

interface ToolCallData {
  name: string
  args: Record<string, unknown>
  result?: unknown
  id?: string
}

interface ToolCallRendererProps {
  toolCall: ToolCallData
  isLoading?: boolean
}

export default function ToolCallRenderer({ toolCall, isLoading }: ToolCallRendererProps) {
  const ToolComponent = getToolComponent(toolCall.name)

  if (!ToolComponent) {
    return (
      <div className="rounded-md border p-2 text-sm text-muted-foreground">
        宸ュ叿璋冪敤锛歿toolCall.name}
        <pre className="mt-1 text-xs">{JSON.stringify(toolCall.args, null, 2)}</pre>
      </div>
    )
  }

  return <ToolComponent args={toolCall.args} result={toolCall.result} isLoading={isLoading} />
}
```

- [ ] **Step 4: 娉ㄥ唽甯哥敤宸ュ叿缁勪欢**锛堟瘡涓伐鍏峰崟鐙枃浠讹紝杩欓噷鍒楀嚭鏍稿績鐨勫嚑涓級

```tsx
// tools/calculator-tool.tsx
import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Calculator } from 'lucide-react'

function CalculatorTool({ args, result }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="璁＄畻鍣? icon={<Calculator className="h-4 w-4" />}>
      <p className="text-sm">琛ㄨ揪寮? {String(args.expression ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm font-medium">缁撴灉: {String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('calculator', CalculatorTool)
registerTool('CalculatorTool', CalculatorTool)

// 鍚岀悊娉ㄥ唽鍏朵粬宸ュ叿...
```

涓烘瘡涓伐鍏锋覆鏌撶粍浠跺垱寤轰竴涓枃浠跺苟娉ㄥ唽銆傚伐鍏峰垪琛紙20+ 涓級锛?- AskUserQuestion, Calculator, Chart, EditFile, Execute, FindKbDocument, GetMindmap, Glob, Grep, Image, KbDocumentPreview, ListDirectory, ListKbs, MysqlDescribeTable, MysqlListTables, MysqlQuery, OcrParseFile, OpenKbDocument, QueryKb, ReadFile, SearchFileContent, SearchFile, SubagentLifecycle, Task, TodoList, WebSearch, WriteFile

- [ ] **Step 5: 鏇存柊 `agent-message.tsx` 闆嗘垚 ToolCall 娓叉煋**

```tsx
import { cn } from '@/lib/utils'
import MarkdownPreview from '@/components/shared/markdown-preview'
import ToolCallRenderer from '../tool-calls/tool-call-renderer'

interface StreamChunk {
  type: string
  content: string
  toolCallId?: string
  toolName?: string
  toolArgs?: string | Record<string, unknown>
  toolResult?: unknown
}

interface AgentMessageProps {
  message: StreamChunk
}

export default function AgentMessage({ message }: AgentMessageProps) {
  if (message.type === 'tool_call' || message.type === 'tool_result') {
    return (
      <div className="flex justify-start px-4">
        <ToolCallRenderer
          toolCall={{
            name: message.toolName ?? 'unknown',
            args: typeof message.toolArgs === 'string' ? JSON.parse(message.toolArgs) : (message.toolArgs ?? {}),
            result: message.toolResult
          }}
        />
      </div>
    )
  }

  const isUser = message.type === 'text'

  return (
    <div className={cn('flex px-4', isUser ? 'justify-end' : 'justify-start')}>
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

- [ ] **Step 6: 鎻愪氦**

```bash
git add web-react/src/features/agent/tool-calls/
git commit -m "feat(web-react): add tool call registry and renderers"
```

---

