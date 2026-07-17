import { registerTool } from '../tool-registry'
import BaseToolCall from '../base-tool-call'
import { Calculator } from 'lucide-react'

function CalculatorTool({ args, result, isLoading }: { args: Record<string, unknown>; result?: unknown; isLoading?: boolean }) {
  return (
    <BaseToolCall title="Calculator" icon={<Calculator className="h-4 w-4" />} isLoading={isLoading}>
      <p className="text-sm">Expression: {String(args.expression ?? '')}</p>
      {result !== undefined && <p className="mt-1 text-sm font-medium">Result: {String(result)}</p>}
    </BaseToolCall>
  )
}
registerTool('calculator', CalculatorTool)
registerTool('CalculatorTool', CalculatorTool)