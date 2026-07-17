import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Folder, Home } from 'lucide-react'

interface WorkspaceSidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export default function WorkspaceSidebar({ currentPath, onNavigate }: WorkspaceSidebarProps) {
  const segments = currentPath.split('/').filter(Boolean)

  return (
    <aside className="w-64 border-r">
      <ScrollArea className="h-full p-2">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onNavigate('/')}>
          <Home className="mr-2 h-4 w-4" /> 根目录
        </Button>
        {segments.map((seg, i) => {
          const path = '/' + segments.slice(0, i + 1).join('/')
          return (
            <Button key={path} variant="ghost" size="sm" className="ml-4 w-[calc(100%-16px)] justify-start"
              onClick={() => onNavigate(path)}>
              <Folder className="mr-2 h-4 w-4" /> {seg}
            </Button>
          )
        })}
      </ScrollArea>
    </aside>
  )
}