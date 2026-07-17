import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FileText, Hash, AlignLeft } from 'lucide-react'

interface Chunk {
  id: string
  content: string
  score?: number
  metadata?: Record<string, string>
  page_number?: number
  tokens?: number
}

interface KBChunkDetailModalProps {
  chunk: Chunk | null
  open: boolean
  onClose: () => void
}

export default function KBChunkDetailModal({ chunk, open, onClose }: KBChunkDetailModalProps) {
  if (!chunk) return null

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Chunk 详情
          </DialogTitle>
          <DialogDescription>
            Chunk ID: {chunk.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {chunk.score !== undefined && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                相似度: {(chunk.score * 100).toFixed(1)}%
              </Badge>
              {chunk.page_number && (
                <Badge variant="outline">第 {chunk.page_number} 页</Badge>
              )}
              {chunk.tokens && (
                <Badge variant="outline">{chunk.tokens} tokens</Badge>
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium">
              <AlignLeft className="h-4 w-4" />
              内容
            </div>
            <ScrollArea className="max-h-[400px]">
              <div className="rounded-lg border bg-muted/20 p-4 text-sm whitespace-pre-wrap">
                {chunk.content}
              </div>
            </ScrollArea>
          </div>

          {chunk.metadata && Object.keys(chunk.metadata).length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Hash className="h-4 w-4" />
                  元数据
                </div>
                <div className="rounded-lg border p-3">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(chunk.metadata).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="py-1 pr-4 text-muted-foreground font-medium">{key}</td>
                          <td className="py-1">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}