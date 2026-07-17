# Task 4.2: 工具函数迁移报告

## 迁移内容

将 Vue 项目 `web/src/utils/` 中的核心工具函数迁移到 React 项目 `web-react/src/lib/`，保持逻辑一致。

### 新建文件

| 文件 | 来源 | 说明 |
|------|------|------|
| `src/lib/error-handler.ts` | `web/src/utils/errorHandler.js` | 统一错误处理类，移除 ant-design-vue 依赖，改为可注入通知函数 |
| `src/lib/file-preview.ts` | `web/src/utils/file_preview.js` | 文件预览工具函数 |
| `src/lib/html-preview-renderer.ts` | `web/src/utils/htmlPreviewRenderer.js` | HTML 预览渲染器，内联了 `escapeHtml` 函数 |
| `src/lib/agent-config-utils.ts` | `web/src/utils/agentConfigUtils.js` | Agent 配置工具函数 |

### 修改文件（新建，原文件不存在）

| 文件 | 来源 | 说明 |
|------|------|------|
| `src/lib/message-processor.ts` | `web/src/utils/messageProcessor.js` | 消息处理类，定义了完整的 TypeScript 接口 |
| `src/lib/file-utils.ts` | `web/src/utils/file_utils.js` | 文件工具函数，依赖 `file-preview.ts` 和 `time.ts` |
| `src/lib/time.ts` | `web/src/utils/time.js` | 时间格式化工具，新增 `dayjs` 依赖 |

### 新增依赖

- `dayjs@1.11.21` - 时间格式化库

## 关键改动

1. **error-handler.ts**: 移除了 `ant-design-vue` 的 `message` 依赖，改为通过 `setNotifyFunction()` 注入通知函数，保持核心逻辑不变
2. **html-preview-renderer.ts**: 内联了 `escapeHtml` 函数（原在 `web/src/utils/html.js` 中）
3. **所有文件**: 添加了完整的 TypeScript 类型定义，适配 `strict: true` 和 `noUncheckedIndexedAccess: true` 配置

## 测试结果

- **pnpm lint**: 通过（仅针对新文件检查，无错误）
- **pnpm tsc --noEmit**: 通过（仅 `src/router/routes.ts` 有预存类型错误，非本任务相关）

## 变更文件

- `web-react/src/lib/error-handler.ts` (新建)
- `web-react/src/lib/file-preview.ts` (新建)
- `web-react/src/lib/html-preview-renderer.ts` (新建)
- `web-react/src/lib/agent-config-utils.ts` (新建)
- `web-react/src/lib/message-processor.ts` (新建)
- `web-react/src/lib/file-utils.ts` (新建)
- `web-react/src/lib/time.ts` (新建)
- `web-react/package.json` (修改 - 新增 dayjs 依赖)
- `web-react/pnpm-lock.yaml` (修改 - 自动更新)