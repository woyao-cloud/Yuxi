import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Play, BarChart3, History, Loader2 } from 'lucide-react'
import EvaluationBenchmarks from './evaluation-benchmarks'

interface RAGEvaluationTabProps {
  kbId: string
}

interface EvaluationResult {
  id: string
  name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  created_at: string
  status: string
}

const mockResults: EvaluationResult[] = [
  {
    id: 'eval-1',
    name: '基础评估 - 2024-01-15',
    accuracy: 0.85,
    precision: 0.82,
    recall: 0.79,
    f1_score: 0.80,
    created_at: '2024-01-15T10:00:00Z',
    status: 'completed'
  },
  {
    id: 'eval-2',
    name: '优化后评估 - 2024-01-20',
    accuracy: 0.91,
    precision: 0.89,
    recall: 0.87,
    f1_score: 0.88,
    created_at: '2024-01-20T14:30:00Z',
    status: 'completed'
  }
]

export default function RAGEvaluationTab({ kbId }: RAGEvaluationTabProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState('')
  const [evalName, setEvalName] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showBenchmarks, setShowBenchmarks] = useState(false)
  const [lastResult] = useState<EvaluationResult | null>(mockResults[1] ?? null)

  const handleRunEvaluation = () => {
    if (!selectedBenchmark || !evalName) return
    setIsRunning(true)
    // Simulate evaluation run
    setTimeout(() => {
      setIsRunning(false)
    }, 3000)
  }

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>RAG 评估</CardTitle>
              <CardDescription>评估知识库检索与生成质量</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowBenchmarks(!showBenchmarks)}>
              <BarChart3 className="h-4 w-4" />
              评估基准
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>评估基准</Label>
              <Select value={selectedBenchmark} onValueChange={(value) => value !== null && setSelectedBenchmark(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择评估基准" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="benchmark-1">基础问答测试集</SelectItem>
                  <SelectItem value="benchmark-2">领域专业知识测试</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>评估名称</Label>
              <Input
                value={evalName}
                onChange={(e) => setEvalName(e.target.value)}
                placeholder="输入评估名称"
              />
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleRunEvaluation}
              disabled={!selectedBenchmark || !evalName || isRunning}
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? '评估中...' : '开始评估'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showBenchmarks && (
        <EvaluationBenchmarks kbId={kbId} />
      )}

      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle>最近评估结果</CardTitle>
            <CardDescription>{lastResult.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold text-primary">{formatPercent(lastResult.accuracy)}</div>
                <div className="text-xs text-muted-foreground mt-1">准确率</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{formatPercent(lastResult.precision)}</div>
                <div className="text-xs text-muted-foreground mt-1">精确率</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{formatPercent(lastResult.recall)}</div>
                <div className="text-xs text-muted-foreground mt-1">召回率</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{formatPercent(lastResult.f1_score)}</div>
                <div className="text-xs text-muted-foreground mt-1">F1 Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <CardTitle>历史评估</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {mockResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <div className="text-sm font-medium">{result.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(result.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>F1: {formatPercent(result.f1_score)}</Badge>
                    <Badge variant="secondary">准确率: {formatPercent(result.accuracy)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}