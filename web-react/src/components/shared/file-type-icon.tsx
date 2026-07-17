import {
  File, FileText, FileImage, FileArchive, FileAudio, FileVideo,
  FileCode, FileSpreadsheet, FileJson, type LucideIcon
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  pdf: FileText,
  doc: FileText, docx: FileText,
  xls: FileSpreadsheet, xlsx: FileSpreadsheet,
  ppt: FileText, pptx: FileText,
  zip: FileArchive, rar: FileArchive, tar: FileArchive, gz: FileArchive,
  mp3: FileAudio, wav: FileAudio, flac: FileAudio,
  mp4: FileVideo, avi: FileVideo, mov: FileVideo,
  js: FileCode, ts: FileCode, py: FileCode, java: FileCode, go: FileCode,
  rs: FileCode, c: FileCode, cpp: FileCode, h: FileCode,
  json: FileJson, xml: FileJson, yaml: FileJson, yml: FileJson,
  md: FileText,
  png: FileImage, jpg: FileImage, jpeg: FileImage, gif: FileImage, svg: FileImage,
  webp: FileImage
}

interface FileTypeIconProps {
  fileName: string
  className?: string
}

export default function FileTypeIcon({ fileName, className }: FileTypeIconProps) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const Icon = iconMap[ext] ?? File
  return <Icon className={`h-4 w-4 ${className ?? ''}`} />
}