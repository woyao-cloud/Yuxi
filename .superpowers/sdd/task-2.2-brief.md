### Task 2.2：AppLayout 侧边栏完整实现

**Files:**
- Modify: `web-react/src/layouts/app-layout.tsx`
- Create: `web-react/src/features/agent/components/user-info-component.tsx`
- Create: `web-react/src/features/agent/components/task-center-drawer.tsx`
- Create: `web-react/src/features/agent/components/conversation-nav-section.tsx`
- Create: `web-react/src/features/agent/components/conversation-search-modal.tsx`

**Interfaces:**
- Consumes: `useChatStore`, `useAuthStore`, `useAgentStore`, `useUIStore`
- Produces: 瀹屾暣鐨勪富甯冨眬渚ц竟鏍?
- [ ] **Step 1: 瀹炵幇瀹屾暣 `app-layout.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  MessageCirclePlus, FolderKanban, LibraryBig, Box, BarChart3,
  PanelLeftClose, PanelLeftOpen, Search, Github, ClipboardList
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useChatStore } from '@/stores/chat-store'
import { useUIStore } from '@/stores/ui-store'
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
  const { user, isSuperAdmin, isAdmin } = useAuthStore()
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
    { name: '鍒涘缓鏂板璇?, path: '/agent', icon: MessageCirclePlus, exactActive: true },
    { name: '宸ヤ綔鍖?, path: '/workspace', icon: FolderKanban },
    { name: '鏅鸿兘浣撴墿灞?, path: '/extensions', icon: LibraryBig, activePaths: ['/extensions'] },
    { name: '鏅鸿兘浣撶鐞?, path: '/model-manage', icon: Box },
    ...(isSuperAdmin ? [{ name: '鏁版嵁鎬昏', path: '/dashboard', icon: BarChart3 }] : [])
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
                <TooltipTrigger asChild>
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
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className={`justify-start ${sidebarCollapsed ? 'w-9 px-0' : 'w-full'}`}
                  onClick={() => setConversationSearchOpen(true)}>
                  <Search className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="ml-2 truncate">鎼滅储瀵硅瘽</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && <TooltipContent side="right">鎼滅储瀵硅瘽</TooltipContent>}
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
                <Github className="h-4 w-4" />
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
```

- [ ] **Step 2: 鍒涘缓 `user-info-component.tsx`**锛堥鏋讹級

```tsx
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
      <DropdownMenuTrigger asChild>
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
          <User className="mr-2 h-4 w-4" /> 涓汉璁剧疆
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openSettings()}>
          <Settings className="mr-2 h-4 w-4" /> 绯荤粺璁剧疆
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> 閫€鍑虹櫥褰?        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 3: 鍒涘缓 `conversation-nav-section.tsx` 鍜?`conversation-search-modal.tsx`**锛堥鏋讹紝璇︾粏瀹炵幇鍚悗缁樁娈碉級

```tsx
// conversation-nav-section.tsx
import { useChatStore } from '@/stores/chat-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare } from 'lucide-react'

export default function ConversationNavSection() {
  const { threads, currentThreadId, setCurrentThreadId } = useChatStore()

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 py-2">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => {
              setCurrentThreadId(thread.id)
              window.location.href = `/agent/${thread.id}`
            }}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
              currentThreadId === thread.id ? 'bg-accent font-medium' : ''
            }`}
          >
            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{thread.title || '鏂板璇?}</span>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
```

- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/src/layouts/app-layout.tsx web-react/src/features/agent/components/
git commit -m "feat(web-react): implement AppLayout sidebar with navigation"
```

---

