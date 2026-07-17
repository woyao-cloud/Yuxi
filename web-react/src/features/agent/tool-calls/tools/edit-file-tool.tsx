import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { FileEdit } from 'lucide-react'

function EditFileTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Edit File" icon={<FileEdit className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">File: {String(args.file_path ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">File updated</p>}
    </BaseToolCall>
  )
}
registerTool('edit_file', EditFileTool)
registerTool('EditFile', EditFileTool)