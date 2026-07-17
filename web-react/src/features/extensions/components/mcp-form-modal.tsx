import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { extensionsApi } from '@/apis/extensions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface McpFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editSlug?: string
  initialData?: Record<string, unknown>
}

export default function McpFormModal({
  open,
  onOpenChange,
  editSlug,
  initialData
}: McpFormModalProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState((initialData?.name as string) ?? '')
  const [description, setDescription] = useState((initialData?.description as string) ?? '')
  const [command, setCommand] = useState((initialData?.command as string) ?? '')

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      extensionsApi.createMcpServer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
      onOpenChange(false)
      resetForm()
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      extensionsApi.updateMcpServer(editSlug!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mcp-servers'] })
      onOpenChange(false)
      resetForm()
    }
  })

  function resetForm() {
    setName('')
    setDescription('')
    setCommand('')
  }

  function handleSubmit() {
    const data: Record<string, unknown> = { name, description, command }
    if (editSlug) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editSlug ? '编辑 MCP 服务' : '新增 MCP 服务'}</DialogTitle>
          <DialogDescription>
            {editSlug
              ? '修改 MCP 服务的配置信息'
              : '添加一个新的 MCP 服务器来扩展智能体能力'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              placeholder="MCP 服务名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Input
              id="description"
              placeholder="服务描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="command">启动命令</Label>
            <Input
              id="command"
              placeholder="npx -y @modelcontextprotocol/server-filesystem"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">取消</Button>} />
          <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
            {isPending ? '保存中...' : editSlug ? '保存修改' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Label({ children, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      {...props}
    >
      {children}
    </label>
  )
}