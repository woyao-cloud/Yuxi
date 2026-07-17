import { useQuery } from '@tanstack/react-query'
import { systemApi } from '@/apis/system'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ResourceEmptyState from '@/components/shared/resource-empty-state'
import { Cloud, Cpu } from 'lucide-react'

interface ModelProvider {
  name: string
  display_name?: string
  description?: string
  models?: string[]
  enabled?: boolean
}

export default function ModelProviderManagePanel() {
  const { data, isLoading } = useQuery({
    queryKey: ['system-config'],
    queryFn: () => systemApi.getConfig()
  })

  const config = data as Record<string, unknown> | undefined
  const providers: ModelProvider[] = (config?.model_providers as ModelProvider[]) ?? []

  if (isLoading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="mt-6">
        <ResourceEmptyState
          title="暂无模型提供商"
          description="系统配置中未发现模型提供商信息"
          icon={<Cloud className="h-12 w-12" />}
        />
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="mb-4 text-sm text-muted-foreground">
        共 {providers.length} 个模型提供商
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <Card key={provider.name}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">
                  {provider.display_name ?? provider.name}
                </CardTitle>
                <Badge
                  variant={provider.enabled !== false ? 'default' : 'secondary'}
                  className="ml-auto"
                >
                  {provider.enabled !== false ? '已启用' : '已禁用'}
                </Badge>
              </div>
              {provider.description && (
                <CardDescription>{provider.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Cpu className="h-3 w-3" />
                  <span>可用模型</span>
                </div>
                {provider.models && provider.models.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {provider.models.map((model) => (
                      <Badge key={model} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">暂无模型</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}