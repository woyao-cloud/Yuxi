import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { agentApi } from '@/apis/agent'
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
import { Textarea } from '@/components/ui/textarea'

interface AgentEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentId?: string
  initialData?: Record<string, unknown>
}

export default function AgentEditModal({
  open,
  onOpenChange,
  agentId,
  initialData
}: AgentEditModalProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState((initialData?.name as string) ?? '')
  const [description, setDescription] = useState((initialData?.description as string) ?? '')
  const [model, setModel] = useState((initialData?.model as string) ?? '')

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => agentApi.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      onOpenChange(false)
      resetForm()
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => agentApi.updateAgent(agentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      onOpenChange(false)
      resetForm()
    }
  })

  function resetForm() {
    setName('')
    setDescription('')
    setModel('')
  }

  function handleSubmit() {
    const data: Record<string, unknown> = { name, description, model }
    if (agentId) {
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
          <DialogTitle>{agentId ? '编辑智能体' : '新建智能体'}</DialogTitle>
          <DialogDescription>
            {agentId
              ? '修改智能体的配置信息'
              : '创建一个新的智能体'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名称</Label>
            <Input
              id="name"
              placeholder="智能体名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              placeholder="智能体描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">模型</Label>
            <Input
              id="model"
              placeholder="默认使用的模型标识"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">取消</Button>} />
          <Button onClick={handleSubmit} disabled={isPending || !name.trim()}>
            {isPending ? '保存中...' : agentId ? '保存修改' : '创建'}
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