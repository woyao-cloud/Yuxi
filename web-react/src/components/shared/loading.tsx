import { Loader2 } from 'lucide-react'

interface LoadingProps {
  fullScreen?: boolean
  text?: string
}

export default function Loading({ fullScreen = true, text = '加载中...' }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? 'h-screen w-screen' : 'h-full w-full'}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}