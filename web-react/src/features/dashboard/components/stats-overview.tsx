import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Bot, PhoneCall, BookOpen, Wrench, Users } from 'lucide-react'

const overviewItems = [
  { key: 'agents', label: 'Agent 总数', icon: Bot, color: 'text-blue-500' },
  { key: 'calls', label: '调用次数', icon: PhoneCall, color: 'text-green-500' },
  { key: 'knowledge', label: '知识库文档', icon: BookOpen, color: 'text-amber-500' },
  { key: 'tools', label: '工具数量', icon: Wrench, color: 'text-purple-500' },
  { key: 'users', label: '用户数量', icon: Users, color: 'text-rose-500' }
]

interface StatsOverviewProps {
  stats?: Record<string, unknown>
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {overviewItems.map((item) => {
        const Icon = item.icon
        const value = stats?.[item.key]
        return (
          <Card key={item.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              {value !== undefined ? (
                <div className="text-2xl font-bold">{String(value)}</div>
              ) : (
                <Skeleton className="h-8 w-16" />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}