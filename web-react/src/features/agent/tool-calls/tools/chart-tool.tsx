import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { BarChart3 } from 'lucide-react'

function ChartTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Chart" icon={<BarChart3 className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Type: {String(args.type ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">Chart generated</p>}
    </BaseToolCall>
  )
}
registerTool('chart', ChartTool)
registerTool('Chart', ChartTool)