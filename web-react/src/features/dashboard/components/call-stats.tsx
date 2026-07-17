import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PhoneCall } from 'lucide-react'

interface CallStat {
  date: string
  count: number
  tokens: number
}

export default function CallStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-call-stats'],
    queryFn: () => dashboardApi.getCallStats()
  })

  const callStats = (data as CallStat[]) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-green-500" />
          调用统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : callStats.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-2 text-xs font-medium text-muted-foreground">
              <span>日期</span>
              <span>调用次数</span>
            </div>
            {callStats.map((stat) => (
              <div
                key={stat.date}
                className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
              >
                <span className="text-sm">{stat.date}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold tabular-nums">
                    {stat.count.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {(stat.tokens / 1000).toFixed(1)}k tokens
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}