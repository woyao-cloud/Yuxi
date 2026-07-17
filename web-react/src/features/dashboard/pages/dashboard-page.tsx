import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import PageHeader from '@/components/shared/page-header'
import StatsOverview from '../components/stats-overview'
import AgentStats from '../components/agent-stats'
import CallStats from '../components/call-stats'

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats()
  })

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="数据总览" />
      <div className="flex-1 space-y-6 overflow-auto p-6">
        <StatsOverview stats={stats as Record<string, unknown>} />
        <div className="grid gap-6 md:grid-cols-2">
          <AgentStats />
          <CallStats />
        </div>
      </div>
    </div>
  )
}