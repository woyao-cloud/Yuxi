/**
 * HTML preview renderer for markdown code blocks
 *
 * Transforms ```html:preview fenced code blocks into sandboxed iframe previews.
 * Regular ```html blocks remain unchanged to avoid breaking source display.
 */

export const HTML_PREVIEW_WIDTH = 800
export const HTML_PREVIEW_HEIGHT = 360
export const HTML_PREVIEW_MIN_HEIGHT = 1
export const HTML_PREVIEW_MAX_HEIGHT = 700

const HTML_PREVIEW_LANGUAGE = 'html:preview'

const isHtmlPreviewLanguage = (language: string): boolean => language === HTML_PREVIEW_LANGUAGE

const isStreamingHtmlPreviewLanguage = (language: string): boolean =>
  language.startsWith('html:') && HTML_PREVIEW_LANGUAGE.startsWith(language)

const renderHtmlPreviewContainer = (content: string): string =>
  [
    `<div class="html-preview-render" style="--html-preview-width: ${HTML_PREVIEW_WIDTH}px; --html-preview-height: ${HTML_PREVIEW_HEIGHT}px; --html-preview-min-height: ${HTML_PREVIEW_MIN_HEIGHT}px; --html-preview-max-height: ${HTML_PREVIEW_MAX_HEIGHT}px;">`,
    content,
    `</div>`
  ].join('')

const escapeHtml = (value: string): string =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const escapeSrcdoc = (value: string): string =>
  escapeHtml(value).replaceAll('\r', '').replaceAll('\n', '&#10;')

const renderHtmlPreviewLoading = (): string =>
  renderHtmlPreviewContainer(
    [
      `<div class="html-preview-loading-slot" aria-live="polite" aria-label="HTML 预览加载中">`,
      `<div class="html-preview-loading-canvas">`,
      `<div class="html-preview-loading-text">HTML 预览加载中...</div>`,
      `<div class="html-preview-skeleton html-preview-skeleton-title"></div>`,
      `<div class="html-preview-skeleton-grid">`,
      `<div class="html-preview-skeleton html-preview-skeleton-card"></div>`,
      `<div class="html-preview-skeleton html-preview-skeleton-card"></div>`,
      `<div class="html-preview-skeleton html-preview-skeleton-card"></div>`,
      `</div>`,
      `<div class="html-preview-skeleton html-preview-skeleton-line wide"></div>`,
      `<div class="html-preview-skeleton html-preview-skeleton-line"></div>`,
      `<div class="html-preview-skeleton html-preview-skeleton-line short"></div>`,
      `</div>`,
      `</div>`
    ].join('')
  )

const renderHtmlPreview = (html: string, sanitizeHtml: (html: string) => string): string => {
  const safeHtml = sanitizeHtml(html)
  const srcdoc = escapeSrcdoc(safeHtml)

  return renderHtmlPreviewContainer(
    [
      `<pre class="html-preview-srcdoc">${srcdoc}</pre>`,
      `<div class="html-preview-frame-slot"></div>`
    ].join('')
  )
}

export interface RenderHtmlPreviewOptions {
  sanitizeHtml?: (html: string) => string
}

/**
 * Transform markdown content containing ```html:preview fenced code blocks
 * into sandboxed iframe preview containers.
 *
 * Unclosed html:preview fences are rendered as loading placeholders.
 */
export function renderHtmlPreviewBlocks(
  markdown: string,
  options: RenderHtmlPreviewOptions = {}
): string {
  const sanitizeHtml = options.sanitizeHtml ?? ((html: string) => html)
  const lines = String(markdown || '').split('\n')
  const output: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]!
    const openMatch = line.match(/^( {0,3})(`{3,}|~{3,})\s*(\S*)/)
    const language = (openMatch?.[3] ?? '').toLowerCase()

    if (
      openMatch &&
      (isHtmlPreviewLanguage(language) || isStreamingHtmlPreviewLanguage(language))
    ) {
      const indent = openMatch[1]!
      const fenceChar = openMatch[2]!
      const openLine = line
      const htmlLines: string[] = []
      i++

      let closed = false
      while (i < lines.length) {
        const currentLine = lines[i]!
        const closeMatch = currentLine.match(/^( {0,3})(`{3,}|~{3,})\s*$/)
        if (
          closeMatch &&
          closeMatch[1]!.length <= indent.length &&
          closeMatch[2]![0] === fenceChar[0] &&
          closeMatch[2]!.length >= fenceChar.length
        ) {
          closed = true
          if (isHtmlPreviewLanguage(language)) {
            output.push(renderHtmlPreview(htmlLines.join('\n'), sanitizeHtml))
          } else {
            output.push([openLine, ...htmlLines, currentLine].join('\n'))
          }
          i++
          break
        }

        htmlLines.push(currentLine)
        i++
      }

      if (!closed) {
        output.push(renderHtmlPreviewLoading())
      }
    } else {
      output.push(line)
      i++
    }
  }

  return output.join('\n')
}