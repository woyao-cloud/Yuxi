import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Terminal } from 'lucide-react'

function ExecuteTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Execute Command" icon={<Terminal className="h-4 w-4" />} isLoading={isLoading}>
      <pre className="rounded bg-muted p-2 text-xs">{String(args.command ?? '')}</pre>
      {result !== undefined && <pre className="mt-1 text-xs text-muted-foreground">{String(result)}</pre>}
    </BaseToolCall>
  )
}
registerTool('execute', ExecuteTool)
registerTool('Execute', ExecuteTool)