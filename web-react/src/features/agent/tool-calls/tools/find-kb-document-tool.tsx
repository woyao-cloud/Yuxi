import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { FileSearch } from 'lucide-react'

function FindKbDocumentTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Find KB Document" icon={<FileSearch className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Query: {String(args.query ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('find_kb_document', FindKbDocumentTool)
registerTool('FindKbDocument', FindKbDocumentTool)