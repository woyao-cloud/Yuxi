import { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface ExtensionToolbarProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  actions?: ReactNode
}

export default function ExtensionToolbar({
  searchPlaceholder = '搜索...',
  searchValue,
  onSearchChange,
  actions
}: ExtensionToolbarProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}