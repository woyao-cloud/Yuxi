# React 19 重写前端设计文档

> 日期：2026-07-17
> 状态：已批准
> 目标：将 `web/` 目录下的 Vue.js 前端用 React 19 重写，保存至 `web-react/` 目录

## 1. 动机与目标

- **技术栈统一**：团队其他项目使用 React，统一技术栈降低维护成本
- **性能提升**：利用 React 19 的并发特性、Suspense、自动批处理等优化用户体验
- **架构现代化**：采用领域驱动架构，提升代码可维护性和可测试性

## 2. 技术选型

| 层面 | 选择 |
|------|------|
| 框架 | **React 19** |
| 构建工具 | **Vite** |
| UI 组件库 | **shadcn/ui + Tailwind CSS** |
| 状态管理 | **Zustand**（客户端状态） |
| 服务端状态 | **TanStack Query** |
| 路由 | **React Router v7** |
| 图标 | **lucide-react**（替代 lucide-vue-next） |
| 图表库 | 保留现有（ECharts/D3/sigma/graphology），React 封装 |
| 样式 | **Tailwind CSS**，dark mode 策略 |
| 语言 | **TypeScript**（全覆盖） |
| 包管理器 | **pnpm** |

## 3. 策略

一次性重写。在 `web-react/` 目录下完整构建 React 版本，开发完成后替换 `web/`。期间 `web/` 保留作为参考。

## 4. 目录结构

```
web-react/
├── public/
├── src/
│   ├── apis/                  # API 层
│   │   ├── client.ts          # HTTP 客户端（认证头、错误处理）
│   │   ├── agent.ts
│   │   ├── auth.ts
│   │   ├── knowledge.ts
│   │   ├── workspace.ts
│   │   ├── extensions.ts
│   │   ├── dashboard.ts
│   │   ├── system.ts
│   │   └── user.ts
│   │
│   ├── stores/                # Zustand 状态
│   │   ├── auth-store.ts
│   │   ├── agent-store.ts
│   │   ├── chat-store.ts
│   │   ├── theme-store.ts
│   │   └── ui-store.ts
│   │
│   ├── hooks/                 # 通用 Hooks
│   │   ├── use-auth.ts
│   │   ├── use-chat-stream.ts
│   │   ├── use-graph.ts
│   │   └── use-scroll.ts
│   │
│   ├── lib/                   # 工具函数
│   │   ├── utils.ts
│   │   ├── message-processor.ts
│   │   ├── file-utils.ts
│   │   ├── time.ts
│   │   └── constants.ts
│   │
│   ├── components/ui/         # shadcn/ui 组件
│   │
│   ├── components/shared/     # 共享业务组件
│   │   ├── page-header.tsx
│   │   ├── fallback-avatar.tsx
│   │   ├── file-type-icon.tsx
│   │   ├── markdown-preview.tsx
│   │   ├── loading.tsx
│   │   └── resource-empty-state.tsx
│   │
│   ├── features/              # 业务领域模块
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │
│   │   ├── agent/             # 核心模块
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── tool-calls/
│   │   │       ├── tool-registry.ts
│   │   │       ├── base-tool-call.tsx
│   │   │       └── tools/
│   │   │
│   │   ├── workspace/
│   │   │   ├── pages/
│   │   │   └── components/
│   │   │
│   │   ├── extensions/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── knowledge-base/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   └── components/
│   │   │
│   │   └── model-manage/
│   │       ├── pages/
│   │       └── components/
│   │
│   ├── layouts/
│   │   ├── app-layout.tsx
│   │   └── blank-layout.tsx
│   │
│   ├── router/
│   │   ├── index.tsx
│   │   ├── auth-guard.tsx
│   │   └── routes.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json
├── package.json
└── Dockerfile
```

## 5. 路由与认证

### 路由表

| 路径 | 页面 | 权限 |
|------|------|------|
| `/` | HomePage | 公开 |
| `/login` | LoginPage | 公开 |
| `/auth/oidc/callback` | OIDCCallbackPage | 公共 |
| `/auth/cli/authorize` | CLIAuthAuthorizePage | 需认证 |
| `/agent` | AgentPage | 需认证 |
| `/agent/:threadId` | AgentPage(带对话) | 需认证 |
| `/workspace` | WorkspacePage | 需认证 |
| `/dashboard` | DashboardPage | SuperAdmin |
| `/model-manage` | ModelManagePage | 需认证 |
| `/extensions` | ExtensionsPage | 需认证 |
| `/extensions/knowledge-base/:kbId` | KnowledgeBaseDetailPage | Admin |
| `/extensions/mcp/:slug` | McpDetailPage | Admin |
| `/extensions/skill/:slug` | SkillDetailPage | 需认证 |
| `*` | NotFoundPage | 公开 |

### 守卫实现

使用 React Router v7 的 layout route 嵌套实现分层守卫：

```
<Routes>
  <Route element={<AuthGuard />}>
    <Route element={<SuperAdminGuard />}>
      <Route path="/dashboard" ... />
    </Route>
    <Route element={<AdminGuard />}>
      <Route path="/extensions/knowledge-base/:kbId" ... />
    </Route>
    <Route element={<AppLayout />}>
      <Route path="/agent" ... />
      <Route path="/workspace" ... />
      ...
    </Route>
  </Route>
  <Route element={<BlankLayout />}>
    <Route path="/login" ... />
    <Route path="/" ... />
  </Route>
</Routes>
```

### 代码分割

所有页面级组件使用 `lazy()` + `Suspense` 懒加载，利用 React 19 的并发 Suspense 优化。

## 6. 状态管理

### 分层

```
┌─────────────────────────────────────────────────┐
│                 组件层 (React)                    │
├──────────────────────┬──────────────────────────┤
│  TanStack Query      │      Zustand              │
│  (服务端状态)         │      (客户端状态)          │
│                      │                          │
│  - Agent 列表        │  - UI 状态 (侧边栏折叠)    │
│  - 对话线程列表       │  - 主题 (亮/暗)           │
│  - 消息历史          │  - 当前选中的 Agent ID     │
│  - 知识库列表        │  - 模态框状态              │
│  - 用户列表          │  - 草稿/本地编辑状态        │
│  - 仪表盘数据        │                          │
├──────────────────────┴──────────────────────────┤
│                  API 层 (纯 fetch)                │
└─────────────────────────────────────────────────┘
```

### 关键数据流：Agent 对话

```
用户输入 → AgentInputArea
  → useChatStream hook (SSE)
    → TanStack Query mutation
      → 流式更新消息列表
        → AgentMessageComponent 逐块渲染
```

## 7. UI 组件

### shadcn/ui 选用组件

Button, Input, Textarea, Dialog, Sheet, DropdownMenu, Tooltip, Badge, Avatar, Card, Tabs, Select, Switch, Popover, ScrollArea, Separator, Skeleton

### 主题

- Tailwind CSS `darkMode: 'class'` 策略
- 自定义色板映射到当前项目的 CSS 变量体系
- 通过 Zustand `theme-store` 管理切换

### 图标

`lucide-react` 统一替换 `lucide-vue-next` 和 `@ant-design/icons-vue`。

## 8. 图表库

保留现有库（ECharts、D3.js、graphology/sigma、@antv/g6），通过 React 封装组件形式集成。

## 9. 页面布局

### AppLayout（主布局）

```
├── 侧边栏
│   ├── Brand (Logo + 组织名)
│   ├── 导航项 (创建对话、工作区、扩展、模型管理、仪表盘)
│   ├── 对话列表
│   ├── GitHub Star 链接
│   └── 用户信息 (头像、角色、任务中心)
│
└── 内容区 (<Outlet />)
```

### BlankLayout（空白布局）

- 用于登录页、首页、OIDC 回调页

## 10. 数据流架构

### API 层

- 基于 `fetch` 的 HTTP 客户端
- 自动注入 `Authorization` 头
- 统一错误处理（401 自动退登、403 权限提示、422 验证错误）
- 支持 `json` / `text` / `blob` 响应类型

### 前端加载流程

```
App mount
  → 检查 token
    → 有 token → 调用 getCurrentUser 验证
      → 成功 → 加载 AppLayout 并预取数据
      → 失败 → 清除 token，跳转登录
    → 无 token → 显示公开页面
```

## 11. 工具函数迁移

Vue 项目的 `utils/` 目录中的工具函数按以下方式映射：

| Vue 工具 | React 方案 |
|----------|-----------|
| messageProcessor.js | 迁移至 `lib/message-processor.ts` |
| file_utils.js | 迁移至 `lib/file-utils.ts` |
| time.js | 迁移至 `lib/time.ts` |
| errorHandler.js | 迁移至 `lib/error-handler.ts` |
| markdown_preview.js | 由 MarkdownPreview 组件替代 |
| agentConfigUtils.js | 合并至 agent-store |
| htmlPreviewRenderer.js | 迁移至 `lib/html-preview-renderer.ts` |
| 其余工具函数 | 按功能迁移至 `lib/` 下对应文件 |

## 12. 过渡计划

1. 搭建项目脚手架（Vite + React + TypeScript + Tailwind + shadcn/ui）
2. 实现基础框架（路由、布局、认证、API 客户端、Zustand stores）
3. 按领域模块逐个实现（建议顺序：auth → agent → workspace → extensions → model-manage → dashboard）
4. 集成测试验证
5. 配置 Docker 开发容器
6. 替换 `web/` 目录

## 13. 架构不变量

- `features/` 模块之间不互相引用
- API 层不做业务逻辑处理
- 服务端状态只通过 TanStack Query 管理
- 客户端状态只通过 Zustand 管理
- TypeScript 全覆盖，禁止使用 any