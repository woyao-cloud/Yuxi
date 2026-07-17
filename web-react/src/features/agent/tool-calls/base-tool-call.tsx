import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface BaseToolCallProps {
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  isLoading?: boolean
}

export default function BaseToolCall({ title, icon, children, isLoading }: BaseToolCallProps) {
  return (
    <Card className="my-2">
      <CardHeader className="py-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-2">{children}</CardContent>
    </Card>
  )
}