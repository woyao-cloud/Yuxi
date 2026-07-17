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
      <PageHeader title="工作区" />
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar currentPath={currentPath} onNavigate={setCurrentPath} />
        <WorkspaceFileList
          files={(files as { files: { name: string; type: 'file' | 'directory'; path: string }[] } | undefined)?.files ?? []}
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