import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { ExternalLink } from 'lucide-react'

function OpenKbDocumentTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Open KB Document" icon={<ExternalLink className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Document: {String(args.document_id ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">Document opened</p>}
    </BaseToolCall>
  )
}
registerTool('open_kb_document', OpenKbDocumentTool)
registerTool('OpenKbDocument', OpenKbDocumentTool)