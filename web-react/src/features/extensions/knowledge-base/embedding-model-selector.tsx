import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EmbeddingModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

const models = [
  { id: 'default', name: '默认模型' },
  { id: 'text-embedding-ada-002', name: 'text-embedding-ada-002' },
  { id: 'text-embedding-3-small', name: 'text-embedding-3-small' },
  { id: 'text-embedding-3-large', name: 'text-embedding-3-large' },
  { id: 'bge-large-zh', name: 'BGE Large (中文)' },
  { id: 'bge-small-zh', name: 'BGE Small (中文)' },
  { id: 'm3e-large', name: 'M3E Large' },
]

export default function EmbeddingModelSelector({ value, onChange }: EmbeddingModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}