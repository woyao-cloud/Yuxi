import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { workspaceApi } from '@/apis/workspace'
import { Loader2 } from 'lucide-react'

interface WorkspacePreviewPaneProps {
  filePath: string
}

export default function WorkspacePreviewPane({ filePath }: WorkspacePreviewPaneProps) {
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['workspace-file-content', filePath],
    queryFn: () => workspaceApi.getFileContent(filePath)
  })

  if (isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (error) return <div className="flex flex-1 items-center justify-center text-destructive">加载失败</div>

  return (
    <aside className="w-96 border-l">
      <ScrollArea className="h-full p-4">
        <pre className="whitespace-pre-wrap break-all text-sm">{content as string}</pre>
      </ScrollArea>
    </aside>
  )
}