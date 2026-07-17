import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { systemApi } from '@/apis/system'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function BasicSettings() {
  const queryClient = useQueryClient()
  const [config, setConfig] = useState<Record<string, string>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['system-config'],
    queryFn: () => systemApi.getConfig()
  })

  useEffect(() => {
    if (data && typeof data === 'object') {
      setConfig(data as Record<string, string>)
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (config: Record<string, string>) =>
      systemApi.updateConfigBatch(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-config'] })
    }
  })

  const handleSave = () => {
    updateMutation.mutate(config)
  }

  const handleChange = (key: string, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [key]: String(value) }))
  }

  if (isLoading) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>基础设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <CardTitle>基础设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {configKeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无系统配置项</p>
        ) : (
          configKeys.map((key) => {
            const value = config[key] ?? ''
            const isBoolean = value === 'true' || value === 'false'

            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={`config-${key}`}>{key}</Label>
                {isBoolean ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`config-${key}`}
                      checked={value === 'true'}
                      onCheckedChange={(checked: boolean) =>
                        handleChange(key, checked)
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {value === 'true' ? '已启用' : '已禁用'}
                    </span>
                  </div>
                ) : (
                  <Input
                    id={`config-${key}`}
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
              </div>
            )
          })
        )}

        {configKeys.length > 0 && (
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? '保存中...' : '保存设置'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}