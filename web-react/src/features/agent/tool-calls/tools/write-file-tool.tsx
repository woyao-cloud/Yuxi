import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { FileEdit } from 'lucide-react'

function WriteFileTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Write File" icon={<FileEdit className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">File: {String(args.file_path ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">File written successfully</p>}
    </BaseToolCall>
  )
}
registerTool('write_file', WriteFileTool)
registerTool('WriteFile', WriteFileTool)