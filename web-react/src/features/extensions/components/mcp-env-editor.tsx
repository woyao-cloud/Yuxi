import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extensionsApi } from '@/apis/extensions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, X, Save } from 'lucide-react'

interface McpEnvEditorProps {
  serverSlug: string
  env: Record<string, string>
  expanded: boolean
}

interface EnvEntry {
  key: string
  value: string
}

export default function McpEnvEditor({ serverSlug, env, expanded }: McpEnvEditorProps) {
  const queryClient = useQueryClient()
  const [entries, setEntries] = useState<EnvEntry[]>(
    Object.entries(env).map(([key, value]) => ({ key, value }))
  )

  const saveMutation = useMutation({
    mutationFn: (data: Record<string, string>) =>
      extensionsApi.updateMcpServer(serverSlug, { env: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-server', serverSlug] })
    }
  })

  function addEntry() {
    setEntries([...entries, { key: '', value: '' }])
  }

  function removeEntry(index: number) {
    setEntries(entries.filter((_, i) => i !== index))
  }

  function updateEntry(index: number, field: 'key' | 'value', val: string) {
    const updated = entries.map((e, i) =>
      i === index ? { ...e, [field]: val } : e
    )
    setEntries(updated)
  }

  function handleSave() {
    const envObj: Record<string, string> = {}
    entries.forEach((e) => {
      if (e.key.trim()) {
        envObj[e.key.trim()] = e.value
      }
    })
    saveMutation.mutate(envObj)
  }

  if (!expanded) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">环境变量</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addEntry}>
            <Plus className="h-3 w-3" />
            添加
          </Button>
          <Button variant="default" size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
            <Save className="h-3 w-3" />
            {saveMutation.isPending ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">暂无环境变量</p>
        )}
        {entries.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="KEY"
              value={entry.key}
              onChange={(e) => updateEntry(index, 'key', e.target.value)}
              className="flex-1 font-mono text-xs"
            />
            <Input
              placeholder="VALUE"
              value={entry.value}
              onChange={(e) => updateEntry(index, 'value', e.target.value)}
              className="flex-1 font-mono text-xs"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEntry(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}