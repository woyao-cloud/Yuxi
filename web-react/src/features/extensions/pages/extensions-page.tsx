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

  const [activeTab, setActiveTab] = useState('knowledge')

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="智能体扩展" />
      <div className="flex-1 p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as string)}
        >
          <TabsList>
            <TabsTrigger value="knowledge" onClick={() => navigate('/extensions')}>
              知识库
            </TabsTrigger>
            <TabsTrigger value="mcp" onClick={() => setActiveTab('mcp')}>
              MCP 服务
            </TabsTrigger>
            <TabsTrigger value="skills" onClick={() => setActiveTab('skills')}>
              技能
            </TabsTrigger>
            <TabsTrigger value="tools" onClick={() => setActiveTab('tools')}>
              工具
            </TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <ExtensionCardGrid activeTab={activeTab} />
          </div>
        </Tabs>
      </div>
    </div>
  )
}