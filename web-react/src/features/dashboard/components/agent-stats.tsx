import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Bot } from 'lucide-react'

interface AgentStat {
  id: string
  name: string
  callCount: number
  activeUsers: number
}

export default function AgentStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-agent-stats'],
    queryFn: () => dashboardApi.getAgentStats()
  })

  const agentStats = (data as AgentStat[]) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-500" />
          Agent 统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : agentStats.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        ) : (
          <div className="space-y-3">
            {agentStats.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{agent.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">调用</p>
                    <p className="text-sm font-semibold">{agent.callCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">用户</p>
                    <p className="text-sm font-semibold">{agent.activeUsers}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}