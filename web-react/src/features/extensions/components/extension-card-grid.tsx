import McpCardList from './mcp-card-list'
import SkillCardList from './skill-card-list'
import ToolsCardList from './tools-card-list'

interface ExtensionCardGridProps {
  activeTab: string
}

export default function ExtensionCardGrid({ activeTab }: ExtensionCardGridProps) {
  switch (activeTab) {
    case 'mcp':
      return <McpCardList />
    case 'skills':
      return <SkillCardList />
    case 'tools':
      return <ToolsCardList />
    default:
      return null
  }
}