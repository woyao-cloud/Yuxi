/**
 * Agent configuration utilities
 */

export const DEFAULT_ALL_AGENT_RESOURCE_KINDS = Object.freeze([
  'tools',
  'knowledges',
  'mcps',
  'skills',
  'subagents'
] as const)

export const MENTION_AGENT_RESOURCE_KINDS = Object.freeze([
  'knowledges',
  'mcps',
  'skills',
  'subagents'
] as const)

export type AgentResourceKind = (typeof DEFAULT_ALL_AGENT_RESOURCE_KINDS)[number]
export type MentionAgentResourceKind = (typeof MENTION_AGENT_RESOURCE_KINDS)[number]

export const isDefaultAllAgentResourceKind = (kind: string): boolean =>
  (DEFAULT_ALL_AGENT_RESOURCE_KINDS as ReadonlyArray<string>).includes(kind)

export const isMentionAgentResourceKind = (kind: string): boolean =>
  (MENTION_AGENT_RESOURCE_KINDS as ReadonlyArray<string>).includes(kind)

export interface AgentConfigOption {
  key?: string
  id?: string
  value?: string
  name?: string
  db_id?: string
  slug?: string
  label?: string
  description?: string
  options?: unknown[]
  [key: string]: unknown
}

export const getAgentConfigOptions = (item: AgentConfigOption): unknown[] =>
  Array.isArray(item?.options) ? item.options : []

export const getAgentConfigOptionValue = (option: unknown): unknown => {
  if (typeof option !== 'object' || option === null) return option
  const opt = option as AgentConfigOption
  return (
    opt.key ??
    opt.id ??
    opt.value ??
    opt.name ??
    opt.db_id ??
    opt.slug ??
    opt.label
  )
}

export const getAgentConfigOptionLabel = (option: unknown): unknown => {
  if (typeof option !== 'object' || option === null) return option
  const opt = option as AgentConfigOption
  return opt.name ?? opt.label ?? getAgentConfigOptionValue(option)
}

export const getAgentConfigOptionDescription = (option: unknown): string =>
  typeof option === 'object' && option !== null
    ? (option as AgentConfigOption).description ?? ''
    : ''