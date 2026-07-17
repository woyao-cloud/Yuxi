import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/apis/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2, UserPlus, Users } from 'lucide-react'

interface User {
  id: string
  username: string
  uid: string
  phone_number: string
  avatar: string
  role: string
  department_id: string | null
  department_name: string
}

export default function UserManagement() {
  const queryClient = useQueryClient()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('user')

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => authApi.getUsers()
  })

  const users: User[] = Array.isArray(data) ? (data as User[]) : []

  const createMutation = useMutation({
    mutationFn: (data: { username: string; password: string; role: string }) =>
      authApi.createUser(data),
    onSuccess: () => {
      setShowCreateForm(false)
      setNewUsername('')
      setNewPassword('')
      setNewRole('user')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => authApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const handleCreate = () => {
    if (!newUsername.trim() || !newPassword.trim()) return
    createMutation.mutate({
      username: newUsername.trim(),
      password: newPassword,
      role: newRole
    })
  }

  const roleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Badge variant="destructive">超级管理员</Badge>
      case 'admin':
        return <Badge>管理员</Badge>
      default:
        return <Badge variant="secondary">普通用户</Badge>
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>用户管理</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            共 {users.length} 个用户
          </p>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <UserPlus className="mr-1 size-4" />
            创建用户
          </Button>
        </div>

        {showCreateForm && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-username">用户名</Label>
              <Input
                id="new-user-username"
                placeholder="用户名"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-password">密码</Label>
              <Input
                id="new-user-password"
                type="password"
                placeholder="密码"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-role">角色</Label>
              <Select value={newRole} onValueChange={(value) => value !== null && setNewRole(value)}>
                <SelectTrigger id="new-user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">普通用户</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={!newUsername.trim() || !newPassword.trim() || createMutation.isPending}
              >
                {createMutation.isPending ? '创建中...' : '创建'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                取消
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Users className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">暂无用户</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户名</TableHead>
                <TableHead>UID</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="text-muted-foreground">{user.uid}</TableCell>
                  <TableCell>{roleBadge(user.role)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.department_name || '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.phone_number || '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteMutation.mutate(user.id)}
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