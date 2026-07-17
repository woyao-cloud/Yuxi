import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { extensionsApi } from '@/apis/extensions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ResourceEmptyState from '@/components/shared/resource-empty-state'
import ExtensionToolbar from './extension-toolbar'
import { Wrench } from 'lucide-react'

interface Tool {
  name: string
  description?: string
  category?: string
}

export default function ToolsCardList() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: () => extensionsApi.listTools()
  })

  const tools: Tool[] = (data as { tools: Tool[] } | undefined)?.tools ?? []

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? '').toLowerCase().includes(search.toLowerCase())
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
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div>
      <ExtensionToolbar
        searchPlaceholder="搜索工具..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      {filtered.length === 0 ? (
        <ResourceEmptyState
          title="暂无工具"
          description="工具是智能体可以调用的功能模块"
          icon={<Wrench className="h-12 w-12" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <Card key={tool.name}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>{tool.name}</CardTitle>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {tool.category && (
                  <Badge variant="outline">{tool.category}</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}