import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Library } from 'lucide-react'

function ListKbsTool({ result, isLoading }: { args?: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="List Knowledge Bases" icon={<Library className="h-4 w-4" />} isLoading={isLoading}>
      {result !== undefined && <p className="text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('list_kbs', ListKbsTool)
registerTool('ListKbs', ListKbsTool)