import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Wrench } from 'lucide-react'

interface ToolStat {
  name: string
  callCount: number
  successRate: number
}

export default function ToolStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-tool-stats'],
    queryFn: () => dashboardApi.getToolStats()
  })

  const stats = (data as ToolStat[]) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-purple-500" />
          工具统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : stats.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        ) : (
          <div className="space-y-3">
            {stats.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm font-medium">{tool.name}</span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">调用</p>
                    <p className="text-sm font-semibold">{tool.callCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">成功率</p>
                    <p className="text-sm font-semibold">
                      {(tool.successRate * 100).toFixed(0)}%
                    </p>
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