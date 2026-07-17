import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { userApi } from '@/apis/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function UserConfigSettings() {
  const [config, setConfig] = useState<Record<string, string>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['user-config'],
    queryFn: () => userApi.getUserConfig()
  })

  useEffect(() => {
    if (data && typeof data === 'object') {
      setConfig(data as Record<string, string>)
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (config: Record<string, unknown>) =>
      userApi.updateUserConfig(config)
  })

  const handleSave = () => {
    updateMutation.mutate(config)
  }

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>用户配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const configKeys = Object.keys(config)

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>用户配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {configKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无用户配置项</p>
        ) : (
          configKeys.map((key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`user-config-${key}`}>{key}</Label>
              <Input
                id={`user-config-${key}`}
                value={config[key] ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))
        )}

        {configKeys.length > 0 && (
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? '保存中...' : '保存'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}