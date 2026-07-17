import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { knowledgeApi } from '@/apis/knowledge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'
import Loading from '@/components/shared/loading'
import KnowledgeSourceSection from './knowledge-source-section'
import KnowledgeGraphSection from './knowledge-graph-section'
import QuerySection from './query-section'
import RAGEvaluationTab from './rag-evaluation-tab'

export default function KnowledgeBaseDetailPage() {
  const { kbId } = useParams<{ kbId: string }>()
  const { data: db, isLoading } = useQuery({
    queryKey: ['knowledge-base', kbId],
    queryFn: () => knowledgeApi.getDatabaseDetail(kbId!),
    enabled: !!kbId
  })

  if (isLoading) return <Loading />
  if (!db) return <div className="p-6 text-muted-foreground">知识库未找到</div>

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={(db as { database: { name: string } }).database?.name ?? '知识库详情'} />
      <div className="flex-1 p-6">
        <Tabs defaultValue="sources">
          <TabsList>
            <TabsTrigger value="sources">知识来源</TabsTrigger>
            <TabsTrigger value="query">查询</TabsTrigger>
            <TabsTrigger value="graph">知识图谱</TabsTrigger>
            <TabsTrigger value="evaluation">评估</TabsTrigger>
          </TabsList>
          <TabsContent value="sources"><KnowledgeSourceSection kbId={kbId!} /></TabsContent>
          <TabsContent value="query"><QuerySection kbId={kbId!} /></TabsContent>
          <TabsContent value="graph"><KnowledgeGraphSection kbId={kbId!} /></TabsContent>
          <TabsContent value="evaluation"><RAGEvaluationTab kbId={kbId!} /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}