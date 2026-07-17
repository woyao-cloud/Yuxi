import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { CheckSquare } from 'lucide-react'

function TaskTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Task" icon={<CheckSquare className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Description: {String(args.description ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('task', TaskTool)
registerTool('Task', TaskTool)