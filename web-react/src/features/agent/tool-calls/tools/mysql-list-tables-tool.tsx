import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Database } from 'lucide-react'

function MysqlListTablesTool({ result, isLoading }: { args?: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="MySQL List Tables" icon={<Database className="h-4 w-4" />} isLoading={isLoading}>
      {result !== undefined && <p className="text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('mysql_list_tables', MysqlListTablesTool)
registerTool('MysqlListTables', MysqlListTablesTool)