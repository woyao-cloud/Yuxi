import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { extensionsApi } from '@/apis/extensions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import ExtensionDetailLayout from './extension-detail-layout'
import McpEnvEditor from './mcp-env-editor'
import { Edit, Trash2, Power } from 'lucide-react'

interface McpServerDetail {
  slug: string
  name: string
  description?: string
  enabled: boolean
  type: string
  command?: string
  args?: string[]
  env?: Record<string, string>
}

export default function McpDetailView() {
  const { slug } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()
  const [showEnvEditor, setShowEnvEditor] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['mcp-server', slug],
    queryFn: () => extensionsApi.getMcpServer(slug!),
    enabled: !!slug
  })

  const toggleMutation = useMutation({
    mutationFn: () =>
      extensionsApi.updateMcpServer(slug!, { enabled: !(data as McpServerDetail | undefined)?.enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-server', slug] })
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => extensionsApi.deleteMcpServer(slug!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
    }
  })

  if (isLoading) {
    return (
      <ExtensionDetailLayout title="加载中...">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </ExtensionDetailLayout>
    )
  }

  const server = data as McpServerDetail | undefined

  if (!server) {
    return (
      <ExtensionDetailLayout title="未找到">
        <p className="text-muted-foreground">MCP 服务不存在</p>
      </ExtensionDetailLayout>
    )
  }

  return (
    <ExtensionDetailLayout
      title={server.name}
      description={server.description}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => setShowEnvEditor(!showEnvEditor)}>
            <Edit className="h-4 w-4" />
            环境变量
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('确定要删除此 MCP 服务吗？')) {
                deleteMutation.mutate()
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            删除
          </Button>
        </>
      }
    >
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="text-sm font-medium">状态</p>
            <p className="text-sm text-muted-foreground">
              {server.enabled ? '已启用' : '已禁用'}
            </p>
          </div>
          <Switch
            checked={server.enabled}
            onCheckedChange={() => toggleMutation.mutate()}
          >
            <Power className="h-3 w-3" />
          </Switch>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">类型</p>
          <Badge variant="outline" className="mt-1">
            {server.type}
          </Badge>
        </div>

        {server.command && (
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">命令</p>
            <code className="mt-1 block rounded bg-muted p-2 text-sm">
              {server.command} {server.args?.join(' ')}
            </code>
          </div>
        )}

        <Separator />

        <McpEnvEditor
          serverSlug={server.slug}
          env={server.env ?? {}}
          expanded={showEnvEditor}
        />
      </div>
    </ExtensionDetailLayout>
  )
}