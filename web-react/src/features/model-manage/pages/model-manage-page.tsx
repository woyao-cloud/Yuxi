import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'
import AgentManagePanel from '../components/agent-manage-panel'
import ModelProviderManagePanel from '../components/model-provider-manage-panel'

export default function ModelManagePage() {
  const [activeTab, setActiveTab] = useState('agents')

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="智能体管理" />
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
          <TabsList>
            <TabsTrigger value="agents">Agent 管理</TabsTrigger>
            <TabsTrigger value="providers">模型提供商</TabsTrigger>
          </TabsList>
          <TabsContent value="agents">
            <AgentManagePanel />
          </TabsContent>
          <TabsContent value="providers">
            <ModelProviderManagePanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}