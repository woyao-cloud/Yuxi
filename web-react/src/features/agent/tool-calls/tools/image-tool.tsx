import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { ImageIcon } from 'lucide-react'

function ImageTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Image" icon={<ImageIcon className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Path: {String(args.path ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">Image processed</p>}
    </BaseToolCall>
  )
}
registerTool('image', ImageTool)
registerTool('Image', ImageTool)