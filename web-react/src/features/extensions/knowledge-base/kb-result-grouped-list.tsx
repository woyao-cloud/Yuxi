import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react'
import KBChunkDetailModal from './kb-chunk-detail-modal'

interface GroupedResult {
  document_id: string
  document_name: string
  chunks: Array<{
    id: string
    content: string
    score: number
    page_number?: number
    metadata?: Record<string, string>
  }>
}

interface KBResultGroupedListProps {
  results: Array<Record<string, unknown>>
}

function groupByDocument(results: Array<Record<string, unknown>>): GroupedResult[] {
  const groups: Record<string, GroupedResult> = {}

  for (const result of results) {
    const docId = (result.document_id as string) || (result.documentId as string) || 'unknown'
    const docName = (result.document_name as string) || (result.documentName as string) || docId

    if (!groups[docId]) {
      groups[docId] = {
        document_id: docId,
        document_name: docName,
        chunks: []
      }
    }

    groups[docId].chunks.push({
      id: (result.id as string) || (result.chunk_id as string) || '',
      content: (result.content as string) || (result.text as string) || (result.chunk_content as string) || '',
      score: (result.score as number) || (result.similarity as number) || 0,
      page_number: result.page_number as number | undefined,
      metadata: result.metadata as Record<string, string> | undefined
    })
  }

  return Object.values(groups)
}

export default function KBResultGroupedList({ results }: KBResultGroupedListProps) {
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set())
  const [selectedChunk, setSelectedChunk] = useState<GroupedResult['chunks'][0] | null>(null)
  const [chunkModalOpen, setChunkModalOpen] = useState(false)

  const groups = groupByDocument(results)

  const toggleDoc = (docId: string) => {
    setExpandedDocs((prev) => {
      const next = new Set(prev)
      if (next.has(docId)) {
        next.delete(docId)
      } else {
        next.add(docId)
      }
      return next
    })
  }

  const handleViewChunk = (chunk: GroupedResult['chunks'][0]) => {
    setSelectedChunk(chunk)
    setChunkModalOpen(true)
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          暂无结果
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isExpanded = expandedDocs.has(group.document_id)
        const topScore = Math.max(...group.chunks.map((c) => c.score))

        return (
          <Card key={group.document_id}>
            <CardContent className="p-0">
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleDoc(group.document_id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">{group.document_name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {group.chunks.length} 个片段
                  </Badge>
                  <Badge className="text-xs">
                    {(topScore * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t">
                  <ScrollArea className="max-h-[500px]">
                    {group.chunks.map((chunk, idx) => (
                      <div
                        key={chunk.id || idx}
                        className="border-b last:border-0 p-3 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                片段 {idx + 1}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {(chunk.score * 100).toFixed(1)}%
                              </Badge>
                              {chunk.page_number && (
                                <span className="text-xs text-muted-foreground">
                                  第 {chunk.page_number} 页
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {chunk.content}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                            onClick={() => handleViewChunk(chunk)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      <KBChunkDetailModal
        chunk={selectedChunk}
        open={chunkModalOpen}
        onClose={() => setChunkModalOpen(false)}
      />
    </div>
  )
}