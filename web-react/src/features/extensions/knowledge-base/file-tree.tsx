import { useState } from 'react'
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileTreeProps {
  documents: Array<{
    id: string
    name: string
    type: string
    path?: string
  }>
  onSelect: (docId: string) => void
}

interface TreeNode {
  name: string
  type: 'folder' | 'file'
  id?: string
  children?: TreeNode[]
}

function buildTree(documents: FileTreeProps['documents']): TreeNode[] {
  const root: TreeNode[] = []

  for (const doc of documents) {
    const parts = (doc.path || doc.name).split('/')
    let current = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLast = i === parts.length - 1

      if (isLast) {
        current.push({ name: part, type: 'file', id: doc.id })
      } else {
        let folder = current.find((n) => n.name === part && n.type === 'folder') as TreeNode | undefined
        if (!folder) {
          folder = { name: part, type: 'folder', children: [] }
          current.push(folder)
        }
        current = folder.children!
      }
    }
  }

  return root
}

function TreeNodeItem({
  node,
  depth,
  onSelect
}: {
  node: TreeNode
  depth: number
  onSelect: (docId: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  if (node.type === 'file') {
    return (
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-muted/50 rounded-sm cursor-pointer text-sm"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => node.id && onSelect(node.id)}
      >
        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="truncate">{node.name}</span>
      </div>
    )
  }

  return (
    <div>
      <div
        className="flex items-center gap-1 py-1 px-2 hover:bg-muted/50 rounded-sm cursor-pointer text-sm font-medium"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
        <span>{node.name}</span>
      </div>
      {expanded && node.children?.map((child, idx) => (
        <TreeNodeItem key={`${child.name}-${idx}`} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default function FileTree({ documents, onSelect }: FileTreeProps) {
  const tree = buildTree(documents)

  if (tree.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        暂无文件
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {tree.map((node, idx) => (
        <TreeNodeItem key={`${node.name}-${idx}`} node={node} depth={0} onSelect={onSelect} />
      ))}
    </div>
  )
}