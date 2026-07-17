import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface GraphNodeDetail {
  id: string
  label: string
  type?: string
  properties?: Record<string, unknown>
}

interface GraphEdgeDetail {
  id: string
  source: string
  target: string
  label?: string
  properties?: Record<string, unknown>
}

interface GraphDetailPanelProps {
  selectedNode?: GraphNodeDetail | null
  selectedEdge?: GraphEdgeDetail | null
  className?: string
}

export default function GraphDetailPanel({
  selectedNode,
  selectedEdge,
  className
}: GraphDetailPanelProps) {
  if (!selectedNode && !selectedEdge) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">详情</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">选择一个节点或边以查看详情</p>
        </CardContent>
      </Card>
    )
  }

  if (selectedNode) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            节点详情
            <Badge variant="secondary">{selectedNode.type ?? '未分类'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono">{selectedNode.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">标签</dt>
                <dd>{selectedNode.label}</dd>
              </div>
              {selectedNode.properties &&
                Object.entries(selectedNode.properties).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="max-w-48 truncate text-right">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </dd>
                  </div>
                ))}
            </dl>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  if (selectedEdge) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">边详情</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID</dt>
                <dd className="font-mono">{selectedEdge.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">来源</dt>
                <dd className="font-mono">{selectedEdge.source}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">目标</dt>
                <dd className="font-mono">{selectedEdge.target}</dd>
              </div>
              {selectedEdge.label && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">标签</dt>
                  <dd>{selectedEdge.label}</dd>
                </div>
              )}
              {selectedEdge.properties &&
                Object.entries(selectedEdge.properties).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <dt className="text-muted-foreground">{key}</dt>
                    <dd className="max-w-48 truncate text-right">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </dd>
                  </div>
                ))}
            </dl>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  return null
}