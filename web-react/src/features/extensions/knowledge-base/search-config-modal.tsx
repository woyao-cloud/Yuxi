import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sliders } from 'lucide-react'
import EmbeddingModelSelector from './embedding-model-selector'
import RerankModelSelector from './rerank-model-selector'

interface SearchConfigModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchConfigModal({ open, onClose }: SearchConfigModalProps) {
  const [topK, setTopK] = useState('10')
  const [scoreThreshold, setScoreThreshold] = useState('0.7')
  const [enableRerank, setEnableRerank] = useState(true)
  const [searchMode, setSearchMode] = useState('hybrid')
  const [embeddingModel, setEmbeddingModel] = useState('default')
  const [rerankModel, setRerankModel] = useState('default')

  const handleSave = () => {
    // TODO: persist search configuration
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            搜索配置
          </DialogTitle>
          <DialogDescription>
            配置知识库检索参数
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>搜索模式</Label>
            <Select value={searchMode} onValueChange={(value) => value !== null && setSearchMode(value)}>
              <SelectTrigger className="w-full">
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

          <Separator />

          <div className="space-y-2">
            <Label>嵌入模型</Label>
            <EmbeddingModelSelector value={embeddingModel} onChange={setEmbeddingModel} />
          </div>

          <div className="flex items-center justify-between">
            <Label>启用重排序</Label>
            <Switch checked={enableRerank} onCheckedChange={setEnableRerank} />
          </div>

          {enableRerank && (
            <div className="space-y-2">
              <Label>重排序模型</Label>
              <RerankModelSelector value={rerankModel} onChange={setRerankModel} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>保存配置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}