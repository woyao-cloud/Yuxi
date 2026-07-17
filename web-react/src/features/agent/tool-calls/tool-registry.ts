import type { ComponentType } from 'react'

interface ToolCallProps {
  args: Record<string, unknown>
  result?: unknown
  isLoading?: boolean
}

type ToolComponent = ComponentType<ToolCallProps>

const toolMap = new Map<string, ToolComponent>()

export function registerTool(name: string, component: ToolComponent) {
  toolMap.set(name, component)
}

export function getToolComponent(name: string): ToolComponent | undefined {
  return toolMap.get(name)
}

export { type ToolCallProps }