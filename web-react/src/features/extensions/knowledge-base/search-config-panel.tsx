import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import EmbeddingModelSelector from './embedding-model-selector'
import RerankModelSelector from './rerank-model-selector'

export default function SearchConfigPanel() {
  const [topK, setTopK] = useState('10')
  const [scoreThreshold, setScoreThreshold] = useState('0.7')
  const [enableRerank, setEnableRerank] = useState(true)
  const [searchMode, setSearchMode] = useState('hybrid')
  const [embeddingModel, setEmbeddingModel] = useState('default')
  const [rerankModel, setRerankModel] = useState('default')

  return (
    <Card>
      <CardHeader>
        <CardTitle>搜索参数配置</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>搜索模式</Label>
            <Select value={searchMode} onValueChange={setSearchMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dense">稠密检索</SelectItem>
                <SelectItem value="sparse">稀疏检索</SelectItem>
                <SelectItem value="hybrid">混合检索</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Top-K 结果数</Label>
            <Input
              type="number"
              value={topK}
              onChange={(e) => setTopK(e.target.value)}
              min={1}
              max={100}
            />
          </div>

          <div className="space-y-2">
            <Label>分数阈值</Label>
            <Input
              type="number"
              value={scoreThreshold}
              onChange={(e) => setScoreThreshold(e.target.value)}
              min={0}
              max={1}
              step={0.05}
            />
          </div>

          <div className="space-y-2">
            <Label>嵌入模型</Label>
            <EmbeddingModelSelector value={embeddingModel} onChange={setEmbeddingModel} />
          </div>

          <div className="flex items-center justify-between col-span-2">
            <Label>启用重排序</Label>
            <Switch checked={enableRerank} onCheckedChange={setEnableRerank} />
          </div>

          {enableRerank && (
            <div className="space-y-2 col-span-2">
              <Label>重排序模型</Label>
              <RerankModelSelector value={rerankModel} onChange={setRerankModel} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}