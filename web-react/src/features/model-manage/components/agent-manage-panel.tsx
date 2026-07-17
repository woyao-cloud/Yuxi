import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentApi } from '@/apis/agent'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import ResourceEmptyState from '@/components/shared/resource-empty-state'
import AgentEditModal from './agent-edit-modal'
import { Bot, Plus, Pencil, Trash2 } from 'lucide-react'

interface Agent {
  id: string
  name: string
  description?: string
  model?: string
  created_at?: string
  updated_at?: string
}

export default function AgentManagePanel() {
  const queryClient = useQueryClient()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editAgentId, setEditAgentId] = useState<string | undefined>()
  const [editInitialData, setEditInitialData] = useState<Record<string, unknown> | undefined>()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentApi.getAgents()
  })

  const deleteMutation = useMutation({
    mutationFn: (agentId: string) => agentApi.deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      setDeleteConfirmId(null)
    }
  })

  const agents: Agent[] = (data as { agents: Agent[] } | undefined)?.agents ?? []

  function handleCreate() {
    setEditAgentId(undefined)
    setEditInitialData(undefined)
    setEditModalOpen(true)
  }

  function handleEdit(agent: Agent) {
    setEditAgentId(agent.id)
    setEditInitialData(agent as unknown as Record<string, unknown>)
    setEditModalOpen(true)
  }

  function handleDelete(agentId: string) {
    setDeleteConfirmId(agentId)
  }

  function confirmDelete() {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId)
    }
  }

  if (isLoading) {
    return (
      <div className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          共 {agents.length} 个智能体
        </div>
        <Button onClick={handleCreate} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          新建智能体
        </Button>
      </div>

      {agents.length === 0 ? (
        <ResourceEmptyState
          title="暂无智能体"
          description="点击上方按钮创建第一个智能体"
          icon={<Bot className="h-12 w-12" />}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>模型</TableHead>
              <TableHead className="w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">{agent.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.description ?? '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.model ?? '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(agent)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(agent.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AgentEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        agentId={editAgentId}
        initialData={editInitialData}
      />

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              删除后无法恢复，确认要删除该智能体吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">取消</Button>} />
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}