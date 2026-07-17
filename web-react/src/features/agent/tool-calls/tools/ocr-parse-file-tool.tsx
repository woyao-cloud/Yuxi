import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { ScanText } from 'lucide-react'

function OcrParseFileTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="OCR Parse File" icon={<ScanText className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">File: {String(args.file_path ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">OCR completed</p>}
    </BaseToolCall>
  )
}
registerTool('ocr_parse_file', OcrParseFileTool)
registerTool('OcrParseFile', OcrParseFileTool)