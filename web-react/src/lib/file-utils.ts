/**
 * File utility functions
 *
 * Migrated from Vue project's file_utils.js
 */

import { getPreviewFileExtension } from './file-preview'
import { formatRelative, parseToShanghai } from './time'

export const formatRelativeTime = (value: unknown): string => formatRelative(value)

export const formatStandardTime = (value: unknown): string => {
  const parsed = parseToShanghai(value)
  if (!parsed) return '-'
  return parsed.format('YYYY年MM月DD日 HH:mm:ss')
}

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    done: '处理完成',
    failed: '处理失败',
    processing: '处理中',
    waiting: '等待处理'
  }
  return statusMap[status] ?? status
}

export const formatFileSize = (bytes: number | string | null | undefined): string => {
  if (bytes === 0 || bytes === '0') return '0 B'
  if (!bytes) return '-'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const numBytes = typeof bytes === 'string' ? Number(bytes) : bytes
  const i = Math.floor(Math.log(numBytes) / Math.log(k))
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]!
}

export const getDisplayFileName = (pathOrName: string | null | undefined, fallback = '文件'): string => {
  const value = String(pathOrName || '').trim()
  if (!value) return fallback
  return value.split('/').pop() || value || fallback
}

export const getFileExtensionLabel = (pathOrName: string): string => {
  const extension = getPreviewFileExtension(pathOrName).replace(/^\./, '')
  return extension ? extension.toUpperCase() : ''
}

export const getMimeSubtypeLabel = (mimeType: string): string => {
  const subtype = String(mimeType || '')
    .split('/')
    .pop()
    ?.trim()
  return subtype ? subtype.toUpperCase() : ''
}

export const inferImageMimeTypeFromBase64 = (base64Content: string): string | null => {
  const head = String(base64Content || '').slice(0, 48)
  if (head.startsWith('iVBORw0KGgo')) return 'image/png'
  if (head.startsWith('/9j/')) return 'image/jpeg'
  if (head.startsWith('R0lGODdh') || head.startsWith('R0lGODlh')) return 'image/gif'
  if (head.startsWith('UklGR')) return 'image/webp'
  if (head.startsWith('Qk')) return 'image/bmp'
  return null
}

export interface Attachment {
  file_name?: string
  name?: string
  path?: string
  file_id?: string
  file_type?: string
  file_size?: number | string
  original_artifact_url?: string
  artifact_url?: string
  [key: string]: unknown
}

export interface NormalizedAttachment {
  raw: Attachment
  fileId: string
  name: string
  previewUrl: string
  meta: string
}

export const normalizeAttachmentPreview = (attachment: Attachment): NormalizedAttachment => {
  const name = getDisplayFileName(
    attachment?.file_name || attachment?.name || attachment?.path,
    '附件'
  )
  const fileId = attachment?.file_id || attachment?.path || name
  const fileType = String(attachment?.file_type || '')
  const sizeLabel = formatFileSize(attachment?.file_size)
  const typeLabel = getFileExtensionLabel(name) || getMimeSubtypeLabel(fileType) || '文件'

  return {
    raw: attachment,
    fileId,
    name,
    previewUrl: attachment?.original_artifact_url || attachment?.artifact_url || '',
    meta: [typeLabel, sizeLabel === '-' ? '' : sizeLabel].filter(Boolean).join(' · ')
  }
}

export const normalizeAttachmentPreviews = (
  attachments: Attachment[] | null | undefined
): NormalizedAttachment[] => {
  if (!Array.isArray(attachments)) return []
  return attachments.map(normalizeAttachmentPreview).filter((attachment) => attachment.fileId)
}