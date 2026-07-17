import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Users } from 'lucide-react'

interface UserStat {
  date: string
  activeUsers: number
  newUsers: number
}

export default function UserStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-user-stats'],
    queryFn: () => dashboardApi.getUserStats()
  })

  const stats = (data as UserStat[]) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-4 w-4 text-rose-500" />
          用户统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : stats.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-2 text-xs font-medium text-muted-foreground">
              <span>日期</span>
              <span>活跃用户 / 新增</span>
            </div>
            {stats.map((stat) => (
              <div
                key={stat.date}
                className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
              >
                <span className="text-sm">{stat.date}</span>
                <span className="text-sm font-semibold tabular-nums">
                  {stat.activeUsers} / {stat.newUsers}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}