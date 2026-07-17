import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  MessageCirclePlus, FolderKanban, LibraryBig, Box, BarChart3,
  PanelLeftClose, PanelLeftOpen, Search, GitBranch
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useChatStore } from '@/stores/chat-store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import ConversationNavSection from '@/features/agent/components/conversation-nav-section'
import ConversationSearchModal from '@/features/agent/components/conversation-search-modal'
import UserInfoComponent from '@/features/agent/components/user-info-component'
import TaskCenterDrawer from '@/features/agent/components/task-center-drawer'

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  activePaths?: string[]
  exactActive?: boolean
  hidden?: boolean
}

export default function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, setConversationSearchOpen } = useChatStore()
  const { isSuperAdmin, isAdmin } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [githubStars, setGithubStars] = useState(0)

  useEffect(() => {
    fetch('https://api.github.com/repos/xerrors/Yuxi')
      .then((r) => r.json())
      .then((d) => setGithubStars(d.stargazers_count))
      .catch(() => {})
  }, [])

  const mainList: NavItem[] = [
    { name: '创建新对话', path: '/agent', icon: MessageCirclePlus, exactActive: true },
    { name: '工作区', path: '/workspace', icon: FolderKanban },
    { name: '智能体扩展', path: '/extensions', icon: LibraryBig, activePaths: ['/extensions'] },
    { name: '智能体管理', path: '/model-manage', icon: Box },
    ...(isSuperAdmin ? [{ name: '数据总览', path: '/dashboard', icon: BarChart3 }] : [])
  ]

  const isActive = (item: NavItem) => {
    const paths = item.activePaths ?? [item.path]
    if (item.exactActive) return paths.some((p) => location.pathname === p)
    return paths.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`))
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen">
        <aside
          className={`flex h-full flex-col border-r bg-muted/30 transition-all duration-200 ${
            sidebarCollapsed ? 'w-[56px]' : 'w-[230px]'
          }`}
        >
          {/* Brand */}
          <div className="flex h-9 items-center justify-between px-2 py-1.5">
            {sidebarCollapsed ? (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => useChatStore.getState().setSidebarCollapsed(false)}>
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <span className="truncate text-sm font-semibold">Yuxi</span>
                <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={toggleSidebar}>
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-2">
            {mainList.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger>
                  <Button
                    variant={isActive(item) ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`justify-start ${sidebarCollapsed ? 'w-9 px-0' : 'w-full'}`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && <span className="ml-2 truncate">{item.name}</span>}
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
              </Tooltip>
            ))}

            {/* Search */}
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="sm" className={`justify-start ${sidebarCollapsed ? 'w-9 px-0' : 'w-full'}`}
                  onClick={() => setConversationSearchOpen(true)}>
                  <Search className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="ml-2 truncate">搜索对话</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && <TooltipContent side="right">搜索对话</TooltipContent>}
            </Tooltip>
          </nav>

          {/* Conversation list */}
          <div className="flex-1 overflow-hidden px-2">
            {!sidebarCollapsed && <ConversationNavSection />}
          </div>

          {/* Bottom */}
          <div className="border-t px-2 py-2">
            {/* GitHub */}
            <div className="mb-2 flex items-center justify-between rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent">
              <a href="https://github.com/xerrors/Yuxi" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-inherit no-underline">
                <GitBranch className="h-4 w-4" />
                {!sidebarCollapsed && <span>GitHub</span>}
              </a>
              {!sidebarCollapsed && githubStars > 0 && (
                <Badge variant="secondary" className="text-xs">{(githubStars / 1000).toFixed(1)}k</Badge>
              )}
            </div>
            {/* User */}
            <UserInfoComponent />
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Modals */}
        <ConversationSearchModal />
        {isAdmin && <TaskCenterDrawer />}
      </div>
    </TooltipProvider>
  )
}