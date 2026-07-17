import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lightbulb, Sparkles, ZoomIn, RefreshCw } from 'lucide-react'

interface MindMapSectionProps {
  kbId: string
}

interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
}

const mockMindMap: MindMapNode = {
  id: 'root',
  label: '知识库概览',
  children: [
    {
      id: 'topic-1',
      label: '核心概念',
      children: [
        { id: 'concept-1', label: '知识图谱定义' },
        { id: 'concept-2', label: '实体关系模型' },
        { id: 'concept-3', label: '向量检索技术' }
      ]
    },
    {
      id: 'topic-2',
      label: '应用场景',
      children: [
        { id: 'app-1', label: '智能问答' },
        { id: 'app-2', label: '文档分析' },
        { id: 'app-3', label: '知识推理' }
      ]
    },
    {
      id: 'topic-3',
      label: '技术架构',
      children: [
        { id: 'arch-1', label: '数据管道' },
        { id: 'arch-2', label: '索引策略' },
        { id: 'arch-3', label: '查询优化' }
      ]
    }
  ]
}

function MindMapNodeItem({ node, depth = 0 }: { node: MindMapNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="relative">
      <div
        className={`
          relative z-10 mb-2 rounded-lg border px-3 py-2 text-sm transition-colors
          ${depth === 0 ? 'bg-primary/10 border-primary/20 font-medium' : ''}
          ${depth === 1 ? 'bg-muted/50 ml-6' : ''}
          ${depth >= 2 ? 'ml-12 bg-background' : ''}
          hover:bg-accent/50 cursor-pointer
        `}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {depth === 0 && <Lightbulb className="h-4 w-4 text-primary" />}
          <span>{node.label}</span>
          {hasChildren && (
            <Badge variant="outline" className="ml-auto text-xs">
              {node.children!.length}
            </Badge>
          )}
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="relative pl-4 border-l-2 border-muted ml-3">
          {node.children!.map((child) => (
            <MindMapNodeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MindMapSection({ kbId: _kbId }: MindMapSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mindMap] = useState<MindMapNode | null>(mockMindMap)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-8 w-64 ml-6" />
          <Skeleton className="h-8 w-48 ml-6" />
          <Skeleton className="h-8 w-56 ml-12" />
          <Skeleton className="h-8 w-40 ml-12" />
        </div>
      </div>
    )
  }

  if (!mindMap) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Lightbulb className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">暂无思维导图</h3>
        <p className="text-sm text-muted-foreground mb-4">
          基于知识库内容自动生成思维导图
        </p>
        <Button onClick={handleGenerate}>
          <Sparkles className="h-4 w-4" />
          生成思维导图
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          <span className="text-sm font-medium">知识导图</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={handleGenerate}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-4">
          <MindMapNodeItem node={mindMap} />
        </div>
      </ScrollArea>
    </div>
  )
}