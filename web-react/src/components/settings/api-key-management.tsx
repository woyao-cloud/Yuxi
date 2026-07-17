import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/apis/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2, Plus, Key } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key_preview: string
  created_at: string
  last_used_at: string | null
  is_active: boolean
}

export default function ApiKeyManagement() {
  const queryClient = useQueryClient()
  const [newKeyName, setNewKeyName] = useState('')
  const [newKeyValue, setNewKeyValue] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => authApi.getUsers({ skip: 0, limit: 1 }),
    // This is a placeholder — the actual API key endpoint may differ
    enabled: false
  })

  const createMutation = useMutation({
    mutationFn: (_name: string) =>
      // Placeholder: replace with actual API key creation endpoint
      Promise.resolve({ id: 'new', name: _name, key: 'sk-' + Math.random().toString(36).slice(2) }),
    onSuccess: (result) => {
      setNewKeyValue(result.key)
      setNewKeyName('')
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (_id: string) =>
      // Placeholder: replace with actual API key deletion endpoint
      Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    }
  })

  const handleCreate = () => {
    if (!newKeyName.trim()) return
    createMutation.mutate(newKeyName.trim())
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  // Placeholder data for UI demonstration
  const apiKeys: ApiKey[] = []

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>API 密钥管理</CardTitle>
        <CardDescription>
          管理 API 密钥，用于第三方服务集成
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="new-key-name">密钥名称</Label>
            <Input
              id="new-key-name"
              placeholder="例如: 开发环境"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={!newKeyName.trim() || createMutation.isPending}
          >
            <Plus className="mr-1 size-4" />
            创建密钥
          </Button>
        </div>

        {newKeyValue && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
            <p className="mb-1 text-sm font-medium text-green-800 dark:text-green-200">
              密钥已创建，请立即复制保存
            </p>
            <code className="break-all rounded bg-green-100 px-2 py-1 text-xs dark:bg-green-900">
              {newKeyValue}
            </code>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Key className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">暂无 API 密钥</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>密钥</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {key.key_preview}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.created_at}
                  </TableCell>
                  <TableCell>
                    <Badge variant={key.is_active ? 'default' : 'secondary'}>
                      {key.is_active ? '启用' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(key.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}