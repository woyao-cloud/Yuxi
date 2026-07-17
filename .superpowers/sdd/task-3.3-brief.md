### Task 3.3：Model Manage 模型管理


**Files:**
- Create: `web-react/src/features/model-manage/pages/model-manage-page.tsx`
- Create: `web-react/src/features/model-manage/components/agent-manage-panel.tsx`
- Create: `web-react/src/features/model-manage/components/agent-edit-modal.tsx`
- Create: `web-react/src/features/model-manage/components/model-provider-manage-panel.tsx`

**Interfaces:**
- Consumes: `agentApi`, `systemApi`, shadcn/ui 缁勪欢
- Produces: Agent 鍜屾ā鍨嬫彁渚涘晢绠＄悊椤甸潰

- [ ] **Step 1-3: 鍒涘缓椤甸潰鍜岀粍浠?*

```tsx
// model-manage-page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'
import AgentManagePanel from '../components/agent-manage-panel'
import ModelProviderManagePanel from '../components/model-provider-manage-panel'

export default function ModelManagePage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="鏅鸿兘浣撶鐞? />
      <div className="flex-1 p-6">
        <Tabs defaultValue="agents">
          <TabsList>
            <TabsTrigger value="agents">Agent 绠＄悊</TabsTrigger>
            <TabsTrigger value="providers">妯″瀷鎻愪緵鍟?/TabsTrigger>
          </TabsList>
          <TabsContent value="agents"><AgentManagePanel /></TabsContent>
          <TabsContent value="providers"><ModelProviderManagePanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/src/features/model-manage/
git commit -m "feat(web-react): add model management module"
```

---

