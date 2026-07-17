### Task 1.5：共享业务组件

**Files:**
- Create: `web-react/src/components/shared/page-header.tsx`
- Create: `web-react/src/components/shared/fallback-avatar.tsx`
- Create: `web-react/src/components/shared/file-type-icon.tsx`
- Create: `web-react/src/components/shared/markdown-preview.tsx`
- Create: `web-react/src/components/shared/resource-empty-state.tsx`
- Create: `web-react/src/components/shared/info-card.tsx`
- Create: `web-react/src/components/shared/status-bar.tsx`

**Interfaces:**
- Consumes: shadcn/ui 缁勪欢锛坲i/avatar, ui/card, ui/badge锛?- Produces: 璺ㄩ鍩熷鐢ㄧ殑灞曠ず鍨嬬粍浠?
- [ ] **Step 1: 鍒涘缓 `fallback-avatar.tsx`**

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface FallbackAvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'h-6 w-6', md: 'h-8 w-8', lg: 'h-10 w-10' }

export default function FallbackAvatar({ src, name, size = 'md', className }: FallbackAvatarProps) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <Avatar className={`${sizeMap[size]} ${className ?? ''}`}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
```

- [ ] **Step 2: 鍒涘缓 `resource-empty-state.tsx`**

```tsx
import { Inbox } from 'lucide-react'

interface ResourceEmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export default function ResourceEmptyState({
  title = '鏆傛棤鏁版嵁',
  description,
  icon,
  action
}: ResourceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="text-muted-foreground">
        {icon ?? <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  )
}
```

- [ ] **Step 3: 鍒涘缓 `page-header.tsx`**

```tsx
interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
```

- [ ] **Step 4: 鍒涘缓 `file-type-icon.tsx`锛堟牴鎹枃浠舵墿灞曞悕杩斿洖瀵瑰簲鍥炬爣锛?*

```tsx
import {
  File, FileText, FileImage, FileArchive, FileAudio, FileVideo,
  FileCode, FileSpreadsheet, FilePdf, FileJson, type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  pdf: FilePdf,
  doc: FileText, docx: FileText,
  xls: FileSpreadsheet, xlsx: FileSpreadsheet,
  ppt: FileText, pptx: FileText,
  zip: FileArchive, rar: FileArchive, tar: FileArchive, gz: FileArchive,
  mp3: FileAudio, wav: FileAudio, flac: FileAudio,
  mp4: FileVideo, avi: FileVideo, mov: FileVideo,
  js: FileCode, ts: FileCode, py: FileCode, java: FileCode, go: FileCode,
  rs: FileCode, c: FileCode, cpp: FileCode, h: FileCode,
  json: FileJson, xml: FileJson, yaml: FileJson, yml: FileJson,
  md: FileText,
  png: FileImage, jpg: FileImage, jpeg: FileImage, gif: FileImage, svg: FileImage,
  webp: FileImage
}

interface FileTypeIconProps {
  fileName: string
  className?: string
}

export default function FileTypeIcon({ fileName, className }: FileTypeIconProps) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const Icon = iconMap[ext] ?? File
  return <Icon className={`h-4 w-4 ${className ?? ''}`} />
}
```

- [ ] **Step 5: 鍒涘缓 `markdown-preview.tsx`锛堥鏋讹紝鍚庣画闆嗘垚 markdown-it锛?*

```tsx
interface MarkdownPreviewProps {
  content: string
  className?: string
}

export default function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  // 鍚庣画闆嗘垚 markdown-it + katex + highlight.js
  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
```

- [ ] **Step 6: 鍒涘缓 `info-card.tsx` 鍜?`status-bar.tsx`**

```tsx
// info-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InfoCardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export default function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
```

- [ ] **Step 7: 鎻愪氦**

```bash
git add web-react/src/components/shared/
git commit -m "feat(web-react): add shared business components"
```

---

