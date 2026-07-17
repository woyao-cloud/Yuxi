### Task 2.5：Workspace 工作区

**Files:**
- Create: `web-react/src/features/workspace/pages/workspace-page.tsx`
- Create: `web-react/src/features/workspace/components/workspace-sidebar.tsx`
- Create: `web-react/src/features/workspace/components/workspace-file-list.tsx`
- Create: `web-react/src/features/workspace/components/workspace-preview-pane.tsx`

**Interfaces:**
- Consumes: `workspaceApi`, shadcn/ui 缁勪欢
- Produces: 鏂囦欢娴忚鍜岄瑙堢殑宸ヤ綔鍖洪〉闈?
- [ ] **Step 1: 鍒涘缓 `workspace-page.tsx`**

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { workspaceApi } from '@/apis/workspace'
import WorkspaceSidebar from '../components/workspace-sidebar'
import WorkspaceFileList from '../components/workspace-file-list'
import WorkspacePreviewPane from '../components/workspace-preview-pane'
import PageHeader from '@/components/shared/page-header'

export default function WorkspacePage() {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const { data: files, isLoading } = useQuery({
    queryKey: ['workspace-files', currentPath],
    queryFn: () => workspaceApi.listFiles(currentPath)
  })

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="宸ヤ綔鍖? />
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar currentPath={currentPath} onNavigate={setCurrentPath} />
        <WorkspaceFileList
          files={(files as { files: unknown[] })?.files ?? []}
          isLoading={isLoading}
          currentPath={currentPath}
          onFileSelect={setSelectedFile}
          onNavigate={setCurrentPath}
        />
        {selectedFile && <WorkspacePreviewPane filePath={selectedFile} />}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 鍒涘缓 `workspace-sidebar.tsx`**

```tsx
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
          <Home className="mr-2 h-4 w-4" /> 鏍圭洰褰?        </Button>
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
```

- [ ] **Step 3: 鍒涘缓 `workspace-file-list.tsx`** 鍜?`workspace-preview-pane.tsx`

```tsx
// workspace-file-list.tsx
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import FileTypeIcon from '@/components/shared/file-type-icon'
import ResourceEmptyState from '@/components/shared/resource-empty-state'
import { Folder, ArrowUp, Loader2 } from 'lucide-react'

interface FileItem {
  name: string
  type: 'file' | 'directory'
  path: string
}

interface WorkspaceFileListProps {
  files: FileItem[]
  isLoading: boolean
  currentPath: string
  onFileSelect: (path: string) => void
  onNavigate: (path: string) => void
}

export default function WorkspaceFileList({ files, isLoading, currentPath, onFileSelect, onNavigate }: WorkspaceFileListProps) {
  if (isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!files.length) return <ResourceEmptyState title="姝ょ洰褰曚负绌? />

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="grid gap-1">
        {currentPath !== '/' && (
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate(currentPath.split('/').slice(0, -1).join('/') || '/')}>
            <ArrowUp className="mr-2 h-4 w-4" /> 涓婄骇鐩綍
          </Button>
        )}
        {files.map((file) => (
          <Button
            key={file.path}
            variant="ghost"
            className="justify-start"
            onClick={() => file.type === 'directory' ? onNavigate(file.path) : onFileSelect(file.path)}
          >
            {file.type === 'directory' ? <Folder className="mr-2 h-4 w-4" /> : <FileTypeIcon fileName={file.name} />}
            {file.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
```

- [ ] **Step 4: 鎻愪氦**

```bash
git add web-react/src/features/workspace/
git commit -m "feat(web-react): add workspace module"
```

---

## 闃舵 3锛氫簩绾у姛鑳芥ā鍧?
