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
          <SheetTitle>设置</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue={settingsInitialTab || 'account'} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">账户</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">管理</TabsTrigger>}
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