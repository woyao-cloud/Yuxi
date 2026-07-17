import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { ListTodo } from 'lucide-react'

function TodoListTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Todo List" icon={<ListTodo className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Action: {String(args.action ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm text-muted-foreground">{String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('todo_list', TodoListTool)
registerTool('TodoList', TodoListTool)