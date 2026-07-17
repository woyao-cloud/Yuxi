import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { FileText } from 'lucide-react'

function KbDocumentPreviewTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="KB Document Preview" icon={<FileText className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Document: {String(args.document_id ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('kb_document_preview', KbDocumentPreviewTool)
registerTool('KbDocumentPreview', KbDocumentPreviewTool)