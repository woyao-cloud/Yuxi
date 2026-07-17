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
  if (!files.length) return <ResourceEmptyState title="此目录为空" />

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="grid gap-1">
        {currentPath !== '/' && (
          <Button variant="ghost" className="justify-start" onClick={() => onNavigate(currentPath.split('/').slice(0, -1).join('/') || '/')}>
            <ArrowUp className="mr-2 h-4 w-4" /> 上级目录
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