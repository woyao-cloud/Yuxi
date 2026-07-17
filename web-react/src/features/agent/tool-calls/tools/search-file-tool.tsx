import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { FileSearch } from 'lucide-react'

function SearchFileTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Search File" icon={<FileSearch className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Name: {String(args.name ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('search_file', SearchFileTool)
registerTool('SearchFile', SearchFileTool)