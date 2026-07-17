### Task 3.2：Extensions 知识库详情

**Files:**
- Create: `web-react/src/features/extensions/knowledge-base/knowledge-base-detail-page.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/knowledge-source-section.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/knowledge-graph-section.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/query-section.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/file-table.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/file-tree.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/file-detail-modal.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/chunk-params-config.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/search-config-modal.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/search-config-panel.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/embedding-model-selector.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/rerank-model-selector.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/evaluation-benchmarks.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/rag-evaluation-tab.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/kb-chunk-detail-modal.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/kb-result-grouped-list.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/web-search-result-list.tsx`
- Create: `web-react/src/features/extensions/knowledge-base/mind-map-section.tsx`

**Interfaces:**
- Consumes: `knowledgeApi`, `extensionsApi`, shadcn/ui 缁勪欢, ECharts/D3/graphology React 灏佽
- Produces: 瀹屾暣鐨勭煡璇嗗簱璇︽儏椤甸潰

- [ ] **Step 1: 鍒涘缓 `knowledge-base-detail-page.tsx`** 浣滀负鍏ュ彛

```tsx
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
  if (!db) return <div className="p-6 text-muted-foreground">鐭ヨ瘑搴撴湭鎵惧埌</div>

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={(db as { database: { name: string } }).database?.name ?? '鐭ヨ瘑搴撹鎯?} />
      <div className="flex-1 p-6">
        <Tabs defaultValue="sources">
          <TabsList>
            <TabsTrigger value="sources">鐭ヨ瘑鏉ユ簮</TabsTrigger>
            <TabsTrigger value="query">鏌ヨ</TabsTrigger>
            <TabsTrigger value="graph">鐭ヨ瘑鍥捐氨</TabsTrigger>
            <TabsTrigger value="evaluation">璇勪及</TabsTrigger>
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
```

- [ ] **Step 2-4: 鍒涘缓鍚勪釜瀛愮粍浠?*

锛堟瘡涓瓙缁勪欢瀵瑰簲 Vue 鐗堟湰鐨勫疄鐜帮紝鍔熻兘鍖呮嫭锛氭枃浠跺垪琛?鏍戙€佹枃妗ｄ笂浼犮€佸垎鍧楅厤缃€佹悳绱㈤厤缃€佹煡璇€丷AG 璇勪及銆佺煡璇嗗浘璋卞彲瑙嗗寲銆佹€濈淮瀵煎浘绛夛級

- [ ] **Step 5: 鎻愪氦**

```bash
git add web-react/src/features/extensions/knowledge-base/
git commit -m "feat(web-react): add knowledge base detail module"
```

---

