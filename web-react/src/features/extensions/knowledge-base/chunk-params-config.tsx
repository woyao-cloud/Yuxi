import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Sliders } from 'lucide-react'

interface ChunkParamsConfigProps {
  open: boolean
  onClose: () => void
}

export default function ChunkParamsConfig({ open, onClose }: ChunkParamsConfigProps) {
  const [chunkSize, setChunkSize] = useState('512')
  const [chunkOverlap, setChunkOverlap] = useState('128')
  const [separator, setSeparator] = useState('\\n\\n')
  const [chunkStrategy, setChunkStrategy] = useState('fixed')

  const handleSave = () => {
    // TODO: persist chunk configuration
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            分块参数配置
          </DialogTitle>
          <DialogDescription>
            配置文档分块策略和参数
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>分块策略</Label>
            <Select value={chunkStrategy} onValueChange={(value) => value !== null && setChunkStrategy(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">固定大小分块</SelectItem>
                <SelectItem value="recursive">递归分块</SelectItem>
                <SelectItem value="semantic">语义分块</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>分块大小 (tokens)</Label>
            <Input
              type="number"
              value={chunkSize}
              onChange={(e) => setChunkSize(e.target.value)}
              min={64}
              max={4096}
              step={64}
            />
          </div>

          <div className="space-y-2">
            <Label>分块重叠 (tokens)</Label>
            <Input
              type="number"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(e.target.value)}
              min={0}
              max={1024}
              step={16}
            />
          </div>

          <div className="space-y-2">
            <Label>分隔符</Label>
            <Input
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder="\\n\\n"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>保存配置</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}