import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { knowledgeApi } from '@/apis/knowledge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, FolderOpen, Settings2 } from 'lucide-react'
import FileTable from './file-table'
import FileTree from './file-tree'
import FileDetailModal from './file-detail-modal'
import ChunkParamsConfig from './chunk-params-config'

interface KnowledgeSourceSectionProps {
  kbId: string
}

export default function KnowledgeSourceSection({ kbId }: KnowledgeSourceSectionProps) {
  const [activeTab, setActiveTab] = useState('list')
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [showChunkConfig, setShowChunkConfig] = useState(false)

  const { data: documents, isLoading } = useQuery({
    queryKey: ['knowledge-base-documents', kbId],
    queryFn: () => knowledgeApi.getDocuments(kbId),
    enabled: !!kbId
  })

  const docs = (documents as { documents?: unknown[] })?.documents ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4" />
            上传文档
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowChunkConfig(true)}>
            <Settings2 className="h-4 w-4" />
            分块配置
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)}>
        <TabsList>
          <TabsTrigger value="list">
            <FolderOpen className="h-4 w-4" />
            列表视图
          </TabsTrigger>
          <TabsTrigger value="tree">
            <FolderOpen className="h-4 w-4" />
            树形视图
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>文档列表</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <FileTable
                    documents={docs as Array<{ id: string; name: string; type: string; status: string; updated_at: string }>}
                    onSelect={(docId) => setSelectedDocId(docId)}
                  />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tree">
          <Card>
            <CardHeader>
              <CardTitle>文件树</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-6 w-40" />
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <FileTree
                    documents={docs as Array<{ id: string; name: string; type: string; path?: string }>}
                    onSelect={(docId) => setSelectedDocId(docId)}
                  />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedDocId && (
        <FileDetailModal
          kbId={kbId}
          docId={selectedDocId}
          open={!!selectedDocId}
          onClose={() => setSelectedDocId(null)}
        />
      )}

      {showChunkConfig && (
        <ChunkParamsConfig
          open={showChunkConfig}
          onClose={() => setShowChunkConfig(false)}
        />
      )}
    </div>
  )
}