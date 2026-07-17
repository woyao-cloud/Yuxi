import { useAuthStore } from '@/stores/auth-store'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const navigate = useNavigate()

  if (isLoggedIn) return <Navigate to="/agent" replace />

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Yuxi</h1>
      <p className="text-muted-foreground">智能知识库与知识图谱智能体开发平台</p>
      <Button onClick={() => navigate('/login')}>开始使用</Button>
    </div>
  )
}