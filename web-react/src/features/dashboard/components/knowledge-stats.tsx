import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen } from 'lucide-react'

interface KnowledgeStat {
  id: string
  name: string
  documentCount: number
  chunkCount: number
}

export default function KnowledgeStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-knowledge-stats'],
    queryFn: () => dashboardApi.getKnowledgeStats()
  })

  const stats = (data as KnowledgeStat[]) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-500" />
          知识库统计
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : stats.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无数据</p>
        ) : (
          <div className="space-y-3">
            {stats.map((kb) => (
              <div
                key={kb.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm font-medium">{kb.name}</span>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">文档</p>
                    <p className="text-sm font-semibold">{kb.documentCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">切片</p>
                    <p className="text-sm font-semibold">{kb.chunkCount}</p>
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