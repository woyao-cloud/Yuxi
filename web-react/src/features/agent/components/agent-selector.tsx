import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { useAgentStore } from '@/stores/agent-store'

interface Agent {
  id: string
  name: string
}

interface AgentSelectorProps {
  agents: Agent[]
  selectedId: string | null
}

export default function AgentSelector({ agents, selectedId }: AgentSelectorProps) {
  const setSelectedAgentId = useAgentStore((s) => s.setSelectedAgentId)

  const chatAgents = agents.filter((a) => !('is_subagent' in a))

  return (
    <Select
      value={selectedId ?? undefined}
      onValueChange={(val) => setSelectedAgentId(val)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="选择 Agent" />
      </SelectTrigger>
      <SelectContent>
        {chatAgents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}