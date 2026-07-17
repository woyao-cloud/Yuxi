interface StatusBarProps {
  left?: React.ReactNode
  right?: React.ReactNode
  className?: string
}

export default function StatusBar({ left, right, className }: StatusBarProps) {
  return (
    <div className={`flex items-center justify-between border-t px-4 py-1 text-xs text-muted-foreground ${className ?? ''}`}>
      <div className="flex items-center gap-2">{left}</div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  )
}