import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface RerankModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

const models = [
  { id: 'default', name: '默认模型' },
  { id: 'bge-reranker-large', name: 'BGE Reranker Large' },
  { id: 'bge-reranker-v2-m3', name: 'BGE Reranker v2 M3' },
  { id: 'cohere-rerank', name: 'Cohere Rerank' },
  { id: 'jina-reranker-v2', name: 'Jina Reranker v2' },
]

export default function RerankModelSelector({ value, onChange }: RerankModelSelectorProps) {
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