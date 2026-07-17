import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { knowledgeApi } from '@/apis/knowledge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Search, Settings2 } from 'lucide-react'
import SearchConfigPanel from './search-config-panel'
import SearchConfigModal from './search-config-modal'
import KBResultGroupedList from './kb-result-grouped-list'
import WebSearchResultList from './web-search-result-list'

interface QuerySectionProps {
  kbId: string
}

export default function QuerySection({ kbId }: QuerySectionProps) {
  const [queryText, setQueryText] = useState('')
  const [showConfig, setShowConfig] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)

  const queryMutation = useMutation({
    mutationFn: (query: Record<string, unknown>) =>
      knowledgeApi.query(kbId, query)
  })

  const handleSearch = () => {
    if (!queryText.trim()) return
    queryMutation.mutate({ query: queryText, top_k: 10 })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const results = queryMutation.data as {
    results?: unknown[]
    web_results?: unknown[]
    total?: number
  } | null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>知识库查询</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowConfigModal(true)}>
                <Settings2 className="h-4 w-4" />
                搜索配置
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                placeholder="输入查询内容，按 Enter 搜索..."
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px] pr-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSearch}
                disabled={!queryText.trim() || queryMutation.isPending}
              >
                {queryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                搜索
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowConfig(!showConfig)}>
                <Settings2 className="h-4 w-4" />
                配置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showConfig && (
        <SearchConfigPanel />
      )}

      {queryMutation.isPending && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">正在搜索...</span>
          </CardContent>
        </Card>
      )}

      {results && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">共 {results.total ?? results.results?.length ?? 0} 条结果</Badge>
          </div>

          {results.results && results.results.length > 0 && (
            <KBResultGroupedList results={results.results as Record<string, unknown>[]} />
          )}

          {results.web_results && results.web_results.length > 0 && (
            <>
              <Separator />
              <WebSearchResultList results={results.web_results as Record<string, unknown>[]} />
            </>
          )}

          {(!results.results || results.results.length === 0) &&
            (!results.web_results || results.web_results.length === 0) && (
            <Card>
              <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
                未找到相关结果
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <SearchConfigModal
        open={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  )
}