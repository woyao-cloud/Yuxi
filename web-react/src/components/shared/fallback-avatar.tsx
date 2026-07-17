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