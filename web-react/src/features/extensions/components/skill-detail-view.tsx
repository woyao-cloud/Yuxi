import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { extensionsApi } from '@/apis/extensions'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import ExtensionDetailLayout from './extension-detail-layout'
import { ShieldCheck, Lightbulb } from 'lucide-react'

interface SkillDetail {
  slug: string
  name: string
  description?: string
  type: string
  builtin: boolean
  config?: Record<string, unknown>
  prompt_template?: string
}

export default function SkillDetailView() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['skill', slug],
    queryFn: () => extensionsApi.getSkillDetail(slug!),
    enabled: !!slug
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

  const skill = data as SkillDetail | undefined

  if (!skill) {
    return (
      <ExtensionDetailLayout title="未找到">
        <p className="text-muted-foreground">技能不存在</p>
      </ExtensionDetailLayout>
    )
  }

  return (
    <ExtensionDetailLayout
      title={skill.name}
      description={skill.description}
    >
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          {skill.builtin ? (
            <Badge variant="secondary">
              <ShieldCheck className="mr-1 h-3 w-3" />
              内置技能
            </Badge>
          ) : (
            <Badge variant="outline">
              <Lightbulb className="mr-1 h-3 w-3" />
              自定义技能
            </Badge>
          )}
          <Badge variant="outline">{skill.type}</Badge>
        </div>

        {skill.prompt_template && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 text-sm font-medium">提示词模板</h3>
              <ScrollArea className="h-48 rounded-md border">
                <pre className="p-4 text-sm whitespace-pre-wrap">
                  <code>{skill.prompt_template}</code>
                </pre>
              </ScrollArea>
            </div>
          </>
        )}

        {skill.config && Object.keys(skill.config).length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 text-sm font-medium">配置</h3>
              <div className="rounded-lg border p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  <code>{JSON.stringify(skill.config, null, 2)}</code>
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </ExtensionDetailLayout>
  )
}