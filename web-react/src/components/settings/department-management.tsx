import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/apis/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Trash2, Pencil, Building2, Check, X } from 'lucide-react'

interface Department {
  id: string
  name: string
  description?: string
  created_at?: string
}

export default function DepartmentManagement() {
  const queryClient = useQueryClient()
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => userApi.getDepartments()
  })

  const departments: Department[] = Array.isArray(data?.departments)
    ? (data.departments as Department[])
    : []

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description: string }) =>
      userApi.createDepartment(data),
    onSuccess: () => {
      setNewName('')
      setNewDescription('')
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description: string } }) =>
      userApi.updateDepartment(id, data),
    onSuccess: () => {
      setEditingId(null)
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    }
  })

  const handleCreate = () => {
    if (!newName.trim()) return
    createMutation.mutate({ name: newName.trim(), description: newDescription.trim() })
  }

  const startEdit = (dept: Department) => {
    setEditingId(dept.id)
    setEditName(dept.name)
    setEditDescription(dept.description ?? '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditDescription('')
  }

  const saveEdit = (id: string) => {
    if (!editName.trim()) return
    updateMutation.mutate({ id, data: { name: editName.trim(), description: editDescription.trim() } })
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>部门管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <div className="space-y-2">
            <Label htmlFor="dept-name">部门名称</Label>
            <Input
              id="dept-name"
              placeholder="新部门名称"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept-desc">描述</Label>
            <Input
              id="dept-desc"
              placeholder="部门描述（可选）"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleCreate}
              disabled={!newName.trim() || createMutation.isPending}
            >
              <Plus className="mr-1 size-4" />
              添加
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Building2 className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">暂无部门</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  {editingId === dept.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </TableCell>
                      <TableCell />
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => saveEdit(dept.id)}
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={cancelEdit}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {dept.description || '-'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dept.created_at || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => startEdit(dept)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deleteMutation.mutate(dept.id)}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}