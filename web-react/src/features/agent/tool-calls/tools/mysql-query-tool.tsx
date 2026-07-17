import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Database } from 'lucide-react'

function MysqlQueryTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="MySQL Query" icon={<Database className="h-4 w-4" />} isLoading={isLoading}>
      <pre className="rounded bg-muted p-2 text-xs">{String(args.query ?? '')}</pre>
      {result !== undefined && <pre className="mt-1 text-xs text-muted-foreground">{String(result)}</pre>}
    </BaseToolCall>
  )
}
registerTool('mysql_query', MysqlQueryTool)
registerTool('MysqlQuery', MysqlQueryTool)