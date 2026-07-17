import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Database } from 'lucide-react'

function MysqlDescribeTableTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="MySQL Describe Table" icon={<Database className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Table: {String(args.table ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('mysql_describe_table', MysqlDescribeTableTool)
registerTool('MysqlDescribeTable', MysqlDescribeTableTool)