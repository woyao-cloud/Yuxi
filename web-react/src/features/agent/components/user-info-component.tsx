import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { useChatStore } from '@/stores/chat-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Settings, LogOut, User } from 'lucide-react'

export default function UserInfoComponent() {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed } = useChatStore()
  const openSettings = useUIStore((s) => s.openSettingsModal)

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex-1 truncate text-left">
              <p className="truncate text-sm font-medium">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => openSettings('account')}>
          <User className="mr-2 h-4 w-4" /> 个人设置
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSettings()}>
          <Settings className="mr-2 h-4 w-4" /> 系统设置
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> 退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}