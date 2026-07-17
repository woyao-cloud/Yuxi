### Task 3.4：Dashboard 数据总览


**Files:**
- Create: `web-react/src/features/dashboard/pages/dashboard-page.tsx`
- Create: `web-react/src/features/dashboard/components/stats-overview.tsx`
- Create: `web-react/src/features/dashboard/components/agent-stats.tsx`
- Create: `web-react/src/features/dashboard/components/call-stats.tsx`
- Create: `web-react/src/features/dashboard/components/knowledge-stats.tsx`
- Create: `web-react/src/features/dashboard/components/tool-stats.tsx`
- Create: `web-react/src/features/dashboard/components/user-stats.tsx`
- Create: `web-react/src/features/dashboard/components/feedback-modal.tsx`

**Interfaces:**
- Consumes: `dashboardApi`, ECharts React 灏佽
- Produces: 鏁版嵁鎬昏浠〃鐩橀〉闈?
- [ ] **Step 1: 鍒涘缓 `dashboard-page.tsx`**

```tsx
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/apis/dashboard'
import PageHeader from '@/components/shared/page-header'
import StatsOverview from '../components/stats-overview'
import AgentStats from '../components/agent-stats'
import CallStats from '../components/call-stats'

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats()
  })

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="鏁版嵁鎬昏" />
      <div className="flex-1 space-y-6 overflow-auto p-6">
        <StatsOverview stats={stats as Record<string, unknown>} />
        <div className="grid gap-6 md:grid-cols-2">
          <AgentStats />
          <CallStats />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2-3: 鍒涘缓鍚勭粺璁＄粍浠?*

- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/src/features/dashboard/
git commit -m "feat(web-react): add dashboard module"
```

---

## 闃舵 4锛氶泦鎴愪笌閮ㄧ讲

