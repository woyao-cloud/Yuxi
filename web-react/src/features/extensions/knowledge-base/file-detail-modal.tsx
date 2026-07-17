import { useQuery } from '@tanstack/react-query'
import { knowledgeApi } from '@/apis/knowledge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { FileText, Calendar, HardDrive } from 'lucide-react'

interface FileDetailModalProps {
  kbId: string
  docId: string
  open: boolean
  onClose: () => void
}

export default function FileDetailModal({ kbId, docId, open, onClose }: FileDetailModalProps) {
  const { data: docDetail, isLoading } = useQuery({
    queryKey: ['knowledge-base-document', kbId, docId],
    queryFn: () => knowledgeApi.getDocumentDetail(kbId, docId),
    enabled: open && !!kbId && !!docId
  })

  const doc = docDetail as {
    id?: string
    name?: string
    type?: string
    status?: string
    size?: number
    chunk_count?: number
    created_at?: string
    updated_at?: string
    content?: string
  } | null

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {isLoading ? '加载中...' : doc?.name ?? '文档详情'}
          </DialogTitle>
          <DialogDescription>
            文档 ID: {docId}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : doc ? (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <HardDrive className="h-3 w-3" />
                    文件大小
                  </div>
                  <span className="text-sm">{formatSize(doc.size)}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    更新时间
                  </div>
                  <span className="text-sm">
                    {doc.updated_at ? new Date(doc.updated_at).toLocaleString('zh-CN') : '-'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">类型</div>
                  <Badge variant="secondary" className="uppercase text-xs">{doc.type}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">状态</div>
                  <Badge className="text-xs">{doc.status}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">分块数</div>
                  <span className="text-sm">{doc.chunk_count ?? 0}</span>
                </div>
              </div>

              {doc.content && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">文档内容预览</h4>
                    <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans text-xs">{doc.content.slice(0, 2000)}</pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            无法加载文档详情
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}