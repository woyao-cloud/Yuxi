import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Globe } from 'lucide-react'

function WebSearchTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Web Search" icon={<Globe className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Query: {String(args.query ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('web_search', WebSearchTool)
registerTool('WebSearch', WebSearchTool)