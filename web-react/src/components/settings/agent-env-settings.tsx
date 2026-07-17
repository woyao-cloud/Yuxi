import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Trash2, Globe } from 'lucide-react'

interface EnvVar {
  key: string
  value: string
}

export default function AgentEnvSettings() {
  const [envVars, setEnvVars] = useState<EnvVar[]>([
    { key: '', value: '' }
  ])

  const saveMutation = useMutation({
    mutationFn: (_vars: EnvVar[]) =>
      // Placeholder: replace with actual agent env API endpoint
      Promise.resolve(),
    onSuccess: () => {
      // Show success feedback
    }
  })

  const addRow = () => {
    setEnvVars((prev) => [...prev, { key: '', value: '' }])
  }

  const removeRow = (index: number) => {
    setEnvVars((prev) => prev.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: 'key' | 'value', val: string) => {
    setEnvVars((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    )
  }

  const handleSave = () => {
    const validVars = envVars.filter((v) => v.key.trim())
    if (validVars.length > 0) {
      saveMutation.mutate(validVars)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Agent 环境变量</CardTitle>
        <CardDescription>
          配置 Agent 运行时的环境变量
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {envVars.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Globe className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">暂无环境变量</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <Label className="flex items-center text-xs">变量名</Label>
              <Label className="flex items-center text-xs">变量值</Label>
              <span />
            </div>
            {envVars.map((envVar, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  placeholder="变量名"
                  value={envVar.key}
                  onChange={(e) => updateRow(index, 'key', e.target.value)}
                />
                <Input
                  placeholder="变量值"
                  value={envVar.value}
                  onChange={(e) => updateRow(index, 'value', e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeRow(index)}
                  disabled={envVars.length === 1}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={addRow}>
            <Plus className="mr-1 size-4" />
            添加变量
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}