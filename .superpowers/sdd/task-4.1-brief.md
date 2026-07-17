### Task 4.1：Settings 设置模态框


**Files:**
- Create: `web-react/src/components/settings/settings-modal.tsx`
- Create: `web-react/src/components/settings/account-settings.tsx`
- Create: `web-react/src/components/settings/basic-settings.tsx`
- Create: `web-react/src/components/settings/user-config-settings.tsx`
- Create: `web-react/src/components/settings/api-key-management.tsx`
- Create: `web-react/src/components/settings/agent-env-settings.tsx`
- Create: `web-react/src/components/settings/department-management.tsx`
- Create: `web-react/src/components/settings/user-management.tsx`
- Create: `web-react/src/components/settings/share-config-form.tsx`

**Interfaces:**
- Consumes: `useUIStore`, `authApi`, `userApi`, `systemApi`
- Produces: 瀹屾暣鐨勮缃潰鏉?
- [ ] **Step 1: 鍒涘缓 `settings-modal.tsx`**

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import AccountSettings from './account-settings'
import BasicSettings from './basic-settings'
import UserConfigSettings from './user-config-settings'
import ApiKeyManagement from './api-key-management'
import AgentEnvSettings from './agent-env-settings'
import DepartmentManagement from './department-management'
import UserManagement from './user-management'

export default function SettingsModal() {
  const { settingsModalOpen, closeSettingsModal, settingsInitialTab } = useUIStore()
  const { isAdmin, isSuperAdmin } = useAuthStore()

  return (
    <Sheet open={settingsModalOpen} onOpenChange={closeSettingsModal}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>璁剧疆</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue={settingsInitialTab || 'account'} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">璐︽埛</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">绠＄悊</TabsTrigger>}
          </TabsList>
          <TabsContent value="account">
            <AccountSettings />
            <UserConfigSettings />
            <ApiKeyManagement />
            <AgentEnvSettings />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="admin">
              <BasicSettings />
              {isSuperAdmin && <DepartmentManagement />}
              {isSuperAdmin && <UserManagement />}
            </TabsContent>
          )}
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
```

- [ ] **Step 2-3: 鍒涘缓鍚勮缃瓙缁勪欢**

- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/src/components/settings/
git commit -m "feat(web-react): add settings modal with all panels"
```

---

