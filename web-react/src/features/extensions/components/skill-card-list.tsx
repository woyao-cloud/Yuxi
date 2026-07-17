import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { extensionsApi } from '@/apis/extensions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ResourceEmptyState from '@/components/shared/resource-empty-state'
import ExtensionToolbar from './extension-toolbar'
import { Lightbulb } from 'lucide-react'

interface Skill {
  slug: string
  name: string
  description?: string
  type: string
  builtin: boolean
}

export default function SkillCardList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => extensionsApi.listSkills()
  })

  const { data: accessibleData, isLoading: accessibleLoading } = useQuery({
    queryKey: ['skills-accessible'],
    queryFn: () => extensionsApi.listAccessibleSkills()
  })

  const allSkills: Skill[] = (allData as { data: Skill[] } | undefined)?.data ?? []
  const accessibleSkills: Skill[] = (accessibleData as { data: Skill[] } | undefined)?.data ?? []
  const isLoading = allLoading || accessibleLoading

  const accessibleSlugs = new Set(accessibleSkills.map((s) => s.slug))

  const filtered = allSkills.filter(
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
        searchPlaceholder="搜索技能..."
        searchValue={search}
        onSearchChange={setSearch}
      />
      {filtered.length === 0 ? (
        <ResourceEmptyState
          title="暂无技能"
          description="技能用于扩展智能体的能力"
          icon={<Lightbulb className="h-12 w-12" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <Card
              key={skill.slug}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/extensions/skill/${skill.slug}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <CardTitle>{skill.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    {skill.builtin && (
                      <Badge variant="secondary">内置</Badge>
                    )}
                    {accessibleSlugs.has(skill.slug) && (
                      <Badge variant="default">可用</Badge>
                    )}
                  </div>
                </div>
                <CardDescription>{skill.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-muted-foreground">{skill.type}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}