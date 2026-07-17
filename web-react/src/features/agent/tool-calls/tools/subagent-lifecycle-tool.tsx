import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { GitBranch } from 'lucide-react'

function SubagentLifecycleTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Subagent Lifecycle" icon={<GitBranch className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Action: {String(args.action ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('subagent_lifecycle', SubagentLifecycleTool)
registerTool('SubagentLifecycle', SubagentLifecycleTool)