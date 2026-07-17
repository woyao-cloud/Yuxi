import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { knowledgeApi } from '@/apis/knowledge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import MindMapSection from './mind-map-section'

interface KnowledgeGraphSectionProps {
  kbId: string
}

export default function KnowledgeGraphSection({ kbId }: KnowledgeGraphSectionProps) {
  const [viewMode, setViewMode] = useState<'graph' | 'mindmap'>('graph')
  const [zoom, setZoom] = useState(1)

  const { data: graphData, isLoading } = useQuery({
    queryKey: ['knowledge-base-graph', kbId],
    queryFn: () => knowledgeApi.getGraph(kbId),
    enabled: !!kbId
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'graph' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('graph')}
          >
            图谱视图
          </Button>
          <Button
            variant={viewMode === 'mindmap' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mindmap')}
          >
            思维导图
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setZoom(1)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>知识图谱</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'graph' ? (
            <div
              className="h-[600px] w-full rounded-lg border bg-muted/20 flex items-center justify-center"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              {graphData ? (
                <div className="text-center text-muted-foreground">
                  <p>图谱可视化区域</p>
                  <p className="text-xs mt-2">节点数: {(graphData as { nodes?: unknown[] })?.nodes?.length ?? 0}</p>
                  <p className="text-xs">关系数: {(graphData as { edges?: unknown[] })?.edges?.length ?? 0}</p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>暂无图谱数据</p>
                  <p className="text-xs mt-2">请先上传文档并处理</p>
                </div>
              )}
            </div>
          ) : (
            <MindMapSection kbId={kbId} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}