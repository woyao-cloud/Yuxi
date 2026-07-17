import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Share2, Copy, Check } from 'lucide-react'

export default function ShareConfigForm() {
  const [enabled, setEnabled] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const saveMutation = useMutation({
    mutationFn: (_data: { enabled: boolean; url: string }) =>
      // Placeholder: replace with actual share config API endpoint
      Promise.resolve(),
    onSuccess: () => {
      // Show success feedback
    }
  })

  const handleSave = () => {
    saveMutation.mutate({ enabled, url: shareUrl })
  }

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>分享配置</CardTitle>
        <CardDescription>
          配置 Agent 分享链接和权限
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>启用分享</Label>
            <p className="text-xs text-muted-foreground">
              允许通过链接分享 Agent 对话
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        {enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="share-url">分享链接</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  placeholder="https://..."
                  value={shareUrl}
                  onChange={(e) => setShareUrl(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-description">分享描述（可选）</Label>
              <Textarea
                id="share-description"
                placeholder="添加分享描述..."
                className="min-h-20"
              />
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            <Share2 className="mr-1 size-4" />
            {saveMutation.isPending ? '保存中...' : '保存配置'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}