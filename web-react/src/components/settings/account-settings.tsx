import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/apis/auth'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-react'

export default function AccountSettings() {
  const { user, getCurrentUser } = useAuthStore()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [username, setUsername] = useState(user?.username ?? '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number ?? '')

  const updateProfileMutation = useMutation({
    mutationFn: (data: { username: string; phone_number: string }) =>
      authApi.updateProfile(data),
    onSuccess: () => {
      getCurrentUser()
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => authApi.uploadAvatar(file),
    onSuccess: () => {
      getCurrentUser()
    }
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadAvatarMutation.mutate(file)
    }
  }

  const handleSave = () => {
    updateProfileMutation.mutate({ username, phone_number: phoneNumber })
  }

  if (!user) return null

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>账户信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-lg">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatarMutation.isPending}
            >
              <Camera className="mr-1 size-4" />
              更换头像
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="mt-1 text-xs text-muted-foreground">支持 JPG、PNG 格式</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">用户名</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uid">UID</Label>
          <Input id="uid" value={user.uid} disabled />
          <p className="text-xs text-muted-foreground">用户唯一标识，不可修改</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">手机号</Label>
          <Input
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="请输入手机号"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">角色</Label>
          <Input id="role" value={user.role} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">部门</Label>
          <Input id="department" value={user.department_name || '无'} disabled />
        </div>

        <Button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? '保存中...' : '保存'}
        </Button>
      </CardContent>
    </Card>
  )
}