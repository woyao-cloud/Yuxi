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
        {toolCall.name}
        <pre className="mt-1 text-xs">{JSON.stringify(toolCall.args, null, 2)}</pre>
      </div>
    )
  }

  return <ToolComponent args={toolCall.args} result={toolCall.result} isLoading={isLoading} />
}