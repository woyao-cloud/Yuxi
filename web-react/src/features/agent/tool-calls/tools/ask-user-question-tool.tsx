import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { HelpCircle } from 'lucide-react'

function AskUserQuestionTool({ args, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Ask User" icon={<HelpCircle className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">{String(args.question ?? '')}</p>
    </BaseToolCall>
  )
}
registerTool('ask_user_question', AskUserQuestionTool)
registerTool('AskUserQuestion', AskUserQuestionTool)