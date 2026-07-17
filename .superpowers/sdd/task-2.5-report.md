# Task 2.5: Workspace 工作区

## 创建的文件

- `web-react/src/features/workspace/pages/workspace-page.tsx` — 工作区主页面，包含路径状态管理和文件列表查询
- `web-react/src/features/workspace/components/workspace-sidebar.tsx` — 侧边栏，显示当前路径的目录层级导航
- `web-react/src/features/workspace/components/workspace-file-list.tsx` — 文件列表，支持文件/目录浏览、返回上级目录
- `web-react/src/features/workspace/components/workspace-preview-pane.tsx` — 文件预览面板，通过 API 获取文件内容并展示

## 测试结果

- `pnpm lint` — 通过（无错误）
- `pnpm tsc --noEmit` — 通过（无错误）

## 变更文件

- `web-react/src/features/workspace/pages/workspace-page.tsx` (新增)
- `web-react/src/features/workspace/components/workspace-sidebar.tsx` (新增)
- `web-react/src/features/workspace/components/workspace-file-list.tsx` (新增)
- `web-react/src/features/workspace/components/workspace-preview-pane.tsx` (新增)