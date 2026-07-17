import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Eye } from 'lucide-react'

interface FileTableProps {
  documents: Array<{
    id: string
    name: string
    type: string
    status: string
    updated_at: string
  }>
  onSelect: (docId: string) => void
}

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  completed: { label: '已完成', variant: 'default' },
  processing: { label: '处理中', variant: 'secondary' },
  pending: { label: '待处理', variant: 'outline' },
  failed: { label: '失败', variant: 'destructive' }
}

export default function FileTable({ documents, onSelect }: FileTableProps) {
  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        暂无文档
      </div>
    )
  }

  return (
    <div className="w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">文件名</th>
            <th className="pb-2 font-medium">类型</th>
            <th className="pb-2 font-medium">状态</th>
            <th className="pb-2 font-medium">更新时间</th>
            <th className="pb-2 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const statusInfo = statusMap[doc.status] ?? { label: doc.status, variant: 'outline' as const }
            return (
              <tr key={doc.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate max-w-[300px]">{doc.name}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-4">
                  <Badge variant="secondary" className="uppercase text-xs">
                    {doc.type}
                  </Badge>
                </td>
                <td className="py-2.5 pr-4">
                  <Badge variant={statusInfo.variant} className="text-xs">
                    {statusInfo.label}
                  </Badge>
                </td>
                <td className="py-2.5 pr-4 text-muted-foreground">
                  {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString('zh-CN') : '-'}
                </td>
                <td className="py-2.5 text-right">
                  <Button variant="ghost" size="icon-sm" onClick={() => onSelect(doc.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}