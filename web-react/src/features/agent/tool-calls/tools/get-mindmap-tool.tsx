import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Brain } from 'lucide-react'

function GetMindmapTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Mindmap" icon={<Brain className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Topic: {String(args.topic ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">Mindmap generated</p>}
    </BaseToolCall>
  )
}
registerTool('get_mindmap', GetMindmapTool)
registerTool('GetMindmap', GetMindmapTool)