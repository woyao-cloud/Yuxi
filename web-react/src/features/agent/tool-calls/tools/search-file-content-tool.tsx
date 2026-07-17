import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { FileSearch } from 'lucide-react'

function SearchFileContentTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Search File Content" icon={<FileSearch className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Pattern: {String(args.pattern ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('search_file_content', SearchFileContentTool)
registerTool('SearchFileContent', SearchFileContentTool)