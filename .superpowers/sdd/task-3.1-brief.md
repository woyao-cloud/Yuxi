### Task 3.1：Extensions 扩展中心

**Files:**
- Create: `web-react/src/features/extensions/pages/extensions-page.tsx`
- Create: `web-react/src/features/extensions/components/extension-card-grid.tsx`
- Create: `web-react/src/features/extensions/components/extension-detail-layout.tsx`
- Create: `web-react/src/features/extensions/components/extension-toolbar.tsx`
- Create: `web-react/src/features/extensions/components/mcp-card-list.tsx`
- Create: `web-react/src/features/extensions/components/mcp-detail-view.tsx`
- Create: `web-react/src/features/extensions/components/mcp-form-modal.tsx`
- Create: `web-react/src/features/extensions/components/mcp-env-editor.tsx`
- Create: `web-react/src/features/extensions/components/skill-card-list.tsx`
- Create: `web-react/src/features/extensions/components/skill-detail-view.tsx`
- Create: `web-react/src/features/extensions/components/tools-card-list.tsx`

**Interfaces:**
- Consumes: `extensionsApi`, shadcn/ui 缁勪欢
- Produces: 鎵╁睍涓績椤甸潰锛圡CP/Skill/Tool 鐨勫垪琛ㄥ拰璇︽儏锛?
- [ ] **Step 1: 鍒涘缓 `extensions-page.tsx`**锛堜富椤甸潰 + 瀛愯矾鐢憋級

```tsx
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'
import ExtensionCardGrid from '../components/extension-card-grid'

export default function ExtensionsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isDetail = location.pathname.includes('/extensions/')

  if (isDetail) return <Outlet />

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="鏅鸿兘浣撴墿灞? />
      <div className="flex-1 p-6">
        <Tabs defaultValue="knowledge">
          <TabsList>
            <TabsTrigger value="knowledge" onClick={() => navigate('/extensions')}>鐭ヨ瘑搴?/TabsTrigger>
            <TabsTrigger value="mcp" onClick={() => {}}>MCP 鏈嶅姟</TabsTrigger>
            <TabsTrigger value="skills" onClick={() => {}}>鎶€鑳?/TabsTrigger>
            <TabsTrigger value="tools" onClick={() => {}}>宸ュ叿</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 鍒涘缓 MCP 鐩稿叧缁勪欢銆丼kill 缁勪欢銆乀ool 缁勪欢**

锛堟瘡涓粍浠跺疄鐜板搴旂殑鍒楄〃/璇︽儏/琛ㄥ崟鍔熻兘锛屽弬鑰?Vue 鐗堟湰鐨勫搴旂粍浠堕€昏緫锛?
- [ ] **Step 3: 鎻愪氦**

```bash
git add web-react/src/features/extensions/
git commit -m "feat(web-react): add extensions module"
```

---

