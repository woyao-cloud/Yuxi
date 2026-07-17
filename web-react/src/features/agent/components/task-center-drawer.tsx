import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ClipboardList } from 'lucide-react'

export default function TaskCenterDrawer() {
  return (
    <Sheet open>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            任务中心
          </SheetTitle>
          <SheetDescription>
            任务列表将在后续版本中实现
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          暂无进行中的任务
        </div>
      </SheetContent>
    </Sheet>
  )
}