import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { extensionsApi } from '@/apis/extensions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import ResourceEmptyState from '@/components/shared/resource-empty-state'
import ExtensionToolbar from './extension-toolbar'
import McpFormModal from './mcp-form-modal'
import { Server, Plus, Power } from 'lucide-react'

interface McpServer {
  slug: string
  name: string
  description?: string
  enabled: boolean
  type: string
}

export default function McpCardList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['mcp-servers'],
    queryFn: () => extensionsApi.getMcpServers()
  })

  const toggleMutation = useMutation({
    mutationFn: (slug: string) =>
      extensionsApi.updateMcpServer(slug, { enabled: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
    }
  })

  const servers: McpServer[] = (data as { data: McpServer[] } | undefined)?.data ?? []

  const filtered = servers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      <ExtensionToolbar
        searchPlaceholder="搜索 MCP 服务..."
        searchValue={search}
        onSearchChange={setSearch}
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            新增 MCP
          </Button>
        }
      />
      {filtered.length === 0 ? (
        <ResourceEmptyState
          title="暂无 MCP 服务"
          description="添加一个 MCP 服务来扩展智能体的能力"
          icon={<Server className="h-12 w-12" />}
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              新增 MCP
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((server) => (
            <Card
              key={server.slug}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/extensions/mcp/${server.slug}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <CardTitle>{server.name}</CardTitle>
                  </div>
                  <Badge variant={server.enabled ? 'default' : 'secondary'}>
                    {server.enabled ? '已启用' : '已禁用'}
                  </Badge>
                </div>
                <CardDescription>{server.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{server.type}</span>
                  <Switch
                    checked={server.enabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMutation.mutate(server.slug)
                    }}
                  >
                    <Power className="h-3 w-3" />
                  </Switch>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <McpFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  )
}