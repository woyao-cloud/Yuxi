import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen">
      <aside className="flex h-full w-[230px] flex-col border-r bg-muted/30">
        {/* 侧边栏内容将在 Task 2.2 中实现 */}
        <div className="flex h-full items-center justify-center text-muted-foreground">
          侧边栏
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}