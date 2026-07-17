import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Globe, ExternalLink, ArrowUpRight } from 'lucide-react'

interface WebSearchResult {
  title: string
  url: string
  snippet: string
  source?: string
  score?: number
}

interface WebSearchResultListProps {
  results: Array<Record<string, unknown>>
}

function normalizeResult(raw: Record<string, unknown>): WebSearchResult {
  return {
    title: (raw.title as string) || '',
    url: (raw.url as string) || (raw.link as string) || '',
    snippet: (raw.snippet as string) || (raw.content as string) || (raw.description as string) || '',
    source: raw.source as string | undefined,
    score: raw.score as number | undefined
  }
}

export default function WebSearchResultList({ results }: WebSearchResultListProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          暂无搜索结果
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Globe className="h-4 w-4" />
        <span>网络搜索结果</span>
      </div>

      <div className="space-y-2">
        {results.map((raw, idx) => {
          const result = normalizeResult(raw)

          return (
            <Card key={idx}>
              <CardContent className="p-3">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      {result.title}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    {result.score !== undefined && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {(result.score * 100).toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {result.snippet}
                  </p>
                  {result.url && (
                    <div className="flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{result.url}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}