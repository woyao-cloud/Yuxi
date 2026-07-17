import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { FileText } from 'lucide-react'

function ReadFileTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Read File" icon={<FileText className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">File: {String(args.file_path ?? '')}</p>
      {result !== undefined && <pre className="mt-1 max-h-40 overflow-auto rounded bg-muted p-2 text-xs">{String(result)}</pre>}
    </BaseToolCall>
  )
}
registerTool('read_file', ReadFileTool)
registerTool('ReadFile', ReadFileTool)