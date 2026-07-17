import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, Eye, Trash2, Download, Sparkles } from 'lucide-react'

interface EvaluationBenchmarksProps {
  kbId: string
  onSelect?: (benchmarkId: string) => void
}

interface Benchmark {
  id: string
  name: string
  description: string
  question_count: number
  created_at: string
  status: string
}

const mockBenchmarks: Benchmark[] = [
  {
    id: '1',
    name: '基础问答测试集',
    description: '包含常见知识问答的基础测试集',
    question_count: 50,
    created_at: '2024-01-15T08:00:00Z',
    status: 'ready'
  },
  {
    id: '2',
    name: '领域专业知识测试',
    description: '针对特定领域知识的深度测试',
    question_count: 30,
    created_at: '2024-01-20T10:30:00Z',
    status: 'ready'
  }
]

function PreviewDialog({ benchmark }: { benchmark: Benchmark }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="icon-sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{benchmark.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{benchmark.description}</p>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">问题数: {benchmark.question_count}</Badge>
            <Badge>{benchmark.status === 'ready' ? '就绪' : '处理中'}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            创建时间: {new Date(benchmark.created_at).toLocaleDateString('zh-CN')}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">示例问题:</p>
            <div className="rounded-lg border bg-muted/20 p-3 text-sm">
              <ol className="list-decimal list-inside space-y-1">
                <li>什么是知识图谱？</li>
                <li>RAG 技术的核心原理是什么？</li>
                <li>如何优化向量检索的召回率？</li>
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EvaluationBenchmarks({ kbId: _kbId, onSelect }: EvaluationBenchmarksProps) {
  const [benchmarks] = useState<Benchmark[]>(mockBenchmarks)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>评估基准</CardTitle>
            <CardDescription>管理评估测试数据集</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
              上传数据集
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4" />
              AI 生成
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>问题数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    暂无评估基准
                  </TableCell>
                </TableRow>
              ) : (
                benchmarks.map((benchmark) => (
                  <TableRow key={benchmark.id}>
                    <TableCell className="font-medium">{benchmark.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {benchmark.description}
                    </TableCell>
                    <TableCell>{benchmark.question_count}</TableCell>
                    <TableCell>
                      <Badge variant={benchmark.status === 'ready' ? 'default' : 'secondary'}>
                        {benchmark.status === 'ready' ? '就绪' : '处理中'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <PreviewDialog benchmark={benchmark} />
                        <Button variant="ghost" size="icon-sm" onClick={() => onSelect?.(benchmark.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}