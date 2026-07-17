import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Search } from 'lucide-react'

function QueryKbTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Query KB" icon={<Search className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Query: {String(args.query ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('query_kb', QueryKbTool)
registerTool('QueryKb', QueryKbTool)